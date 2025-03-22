from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Build a human-readable message from the errors
        error_messages = []
        # Loop through the response data to build a message string
        for field, messages in response.data.items():
            # Join messages for each field if there are multiple
            error_messages.append(f"{field}: {', '.join(messages)}")
        # Create a single message string from all fields
        message = " ".join(error_messages)

        # Replace response.data with a custom structure
        response.data = {
            "message": message,
            **response.data
        }
    
    return response