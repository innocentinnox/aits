from rest_framework.views import exception_handler 

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        error_messages = []
        # Loop through the response data to build a message string
        for field, messages in response.data.items():
            # Ensure each item is converted to a string (handles dicts as well)
            if isinstance(messages, list):
                converted_messages = [str(message) for message in messages]
                error_messages.append(f"{field}: {', '.join(converted_messages)}")
            else:
                error_messages.append(f"{field}: {str(messages)}")
        # Create a single message string from all fields
        message = " ".join(error_messages)

        # Replace response.data with a custom structure
        response.data = {
            "message": message,
            **response.data
        }
    
    return response
