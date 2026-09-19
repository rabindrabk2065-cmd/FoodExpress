from django import forms
from .models import Order
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class OrderForm(forms.ModelForm):

    class Meta:
        model = Order

        fields = [
            'name',
            'phone',
            'email',
            'address',
            'city',
            'landmark',
            'note',
            'payment_method',
        ]

    def clean_name(self):
        name = self.cleaned_data['name'].strip()

        if len(name) < 3:
            raise forms.ValidationError(
                "Name must be at least 3 characters."
            )

        return name

    def clean_phone(self):
        phone = self.cleaned_data['phone'].strip()

        if not phone.isdigit():
            raise forms.ValidationError(
                "Phone number must contain only digits."
            )

        if len(phone) != 10:
            raise forms.ValidationError(
                "Phone number must be 10 digits."
            )

        if not phone.startswith(("97", "98")):
            raise forms.ValidationError(
                "Enter a valid Nepal phone number."
            )

        return phone

class LoginForm(forms.Form):
    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(
            attrs={
                "class": "form-input",
                "placeholder": "Enter your username",
                "autocomplete": "username",
            }
        )
    )

    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-input",
                "placeholder": "Enter your password",
                "autocomplete": "current-password",
            }
        )
    )


class RegisterForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(
            attrs={
                "class": "form-input",
                "placeholder": "Enter your email",
                "autocomplete": "email",
            }
        )
    )

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

        widgets = {
            "username": forms.TextInput(
                attrs={
                    "class": "form-input",
                    "placeholder": "Choose a username",
                    "autocomplete": "username",
                }
            ),
        }

    def clean_email(self):
        email = self.cleaned_data["email"].strip().lower()

        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError(
                "This email is already registered."
            )

        return email        