from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Try to get the token from the standard header first
        header = self.get_header(request)
        if header is None:
            # If no header, attempt to retrieve it from the cookie
            raw_token = request.COOKIES.get("access_token")
            if raw_token is None:
                return None
            try:
                validated_token = self.get_validated_token(raw_token)
            except Exception:
                return None
            return self.get_user(validated_token), validated_token
        return super().authenticate(request)
