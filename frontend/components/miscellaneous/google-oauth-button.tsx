import { Button } from "@/components/ui/button";
import GoogleIcon from "../icons/google-icon";

const GoogleOAuthButton = () => {
  return (
    <a
      href={`https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google&scope=openid%20profile%20email&access_type=offline`}
    >
      <Button variant="outline" size="lg" className="w-full">
        <GoogleIcon className="mr-2 h-6 w-6" />
        Sign in with Google
      </Button>
    </a>
  );
};

export default GoogleOAuthButton;
