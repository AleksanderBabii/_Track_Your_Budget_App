import {AuthLayout} from "../../components/auth/AuthLayout/AuthLayout";
import {RegisterForm} from "../../components/auth/RegisterForm/RegisterForm";

export function Register() {
    return (
        <AuthLayout
            title="Create an account"
            subtitle="Start tracking your finances with a clear overview of your money."
            footerText="Already have an account?"
            foooterLink="Log in"
            footerLinkTo="/login"
        >
            <RegisterForm />
        </AuthLayout>
    );
}