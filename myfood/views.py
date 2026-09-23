import base64
import hashlib
import hmac
import json
import uuid
from decimal import Decimal

# ==========   esewa ko lagi improt gareko ho  ===========
from django.views.decorators.csrf import csrf_exempt

import requests

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.db.models import Sum
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse

from .models import (
    Order,
    OrderItem,
    Food,
    Category,
    Home,
    ContactInfo,
)

from .forms import (
    OrderForm,
    LoginForm,
    RegisterForm,
)


# ============================================================
# ADMIN ACCESS
# ============================================================

def admin_required(user):
    return user.is_staff


# ============================================================
# ADMIN DASHBOARD
# ============================================================

@user_passes_test(admin_required, login_url="login")
def admin_dashboard(request):

    total_orders = Order.objects.count()

    total_users = User.objects.count()

    total_foods = Food.objects.count()

    total_categories = Category.objects.count()

    pending_orders = Order.objects.filter(
        status="Pending"
    ).count()

    preparing_orders = Order.objects.filter(
        status="Preparing"
    ).count()

    delivered_orders = Order.objects.filter(
        status="Delivered"
    ).count()

    total_sales = (
        Order.objects.filter(
            status="Delivered"
        )
        .aggregate(total=Sum("total_amount"))["total"]
        or 0
    )

    recent_orders = (
        Order.objects
        .select_related("user")
        .order_by("-created_at")[:10]
    )

    context = {
        "total_orders": total_orders,
        "total_users": total_users,
        "total_foods": total_foods,
        "total_categories": total_categories,
        "pending_orders": pending_orders,
        "preparing_orders": preparing_orders,
        "delivered_orders": delivered_orders,
        "total_sales": total_sales,
        "recent_orders": recent_orders,
    }

    return render(
        request,
        "admin_dashboard.html",
        context
    )


# ============================================================
# ADMIN ORDERS
# ============================================================

@user_passes_test(admin_required, login_url="login")
def admin_orders(request):

    orders = (
        Order.objects
        .select_related("user")
        .order_by("-created_at")
    )

    return render(
        request,
        "admin_orders.html",
        {
            "orders": orders
        }
    )


# ============================================================
# ADMIN ORDER DETAIL
# ============================================================

@user_passes_test(admin_required, login_url="login")
def admin_order_detail(request, order_id):

    order = get_object_or_404(
        Order,
        id=order_id
    )

    items = OrderItem.objects.filter(
        order=order
    )

    status_choices = Order._meta.get_field(
        "status"
    ).choices

    if request.method == "POST":

        new_status = request.POST.get("status")

        allowed_statuses = [
            value
            for value, label in status_choices
        ]

        if new_status in allowed_statuses:

            order.status = new_status
            order.save(
                update_fields=["status"]
            )

            messages.success(
                request,
                "Order status updated successfully."
            )

        return redirect(
            "admin_order_detail",
            order_id=order.id
        )

    return render(
        request,
        "admin_order_detail.html",
        {
            "order": order,
            "items": items,
            "status_choices": status_choices,
        }
    )


# ============================================================
# HOME
# ============================================================

def home(request):

    home_data = Home.objects.first()

    return render(
        request,
        "home.html",
        {
            "home": home_data
        }
    )


# ============================================================
# CONTACT
# ============================================================

def contact(request):

    contact_info = ContactInfo.objects.first()

    return render(
        request,
        "contact.html",
        {
            "contact_info": contact_info
        }
    )


# ============================================================
# CHOWMEIN
# ============================================================

def chowmein(request):

    foods = Food.objects.filter(
        category__name__iexact="Chowmein"
    )

    return render(
        request,
        "chowmein.html",
        {
            "foods": foods
        }
    )


# ============================================================
# MOMO
# ============================================================

def momo(request):

    foods = Food.objects.filter(
        category__name__iexact="Momo"
    )

    return render(
        request,
        "momo.html",
        {
            "foods": foods
        }
    )


# ============================================================
# RESTAURANTS
# ============================================================

def restaurants(request):

    return render(
        request,
        "restaurants.html"
    )


# ============================================================
# FOOD
# ============================================================

def food(request):

    categories = Category.objects.all()

    return render(
        request,
        "food.html",
        {
            "categories": categories
        }
    )


# ============================================================
# CATEGORY DETAIL
# ============================================================

def category_detail(request, category_id):

    category = get_object_or_404(
        Category,
        id=category_id
    )

    foods = Food.objects.filter(
        category=category
    )

    return render(
        request,
        "category_detail.html",
        {
            "category": category,
            "foods": foods
        }
    )


# ============================================================
# USER ORDER DETAIL
# ============================================================

@login_required(login_url="login")
def order_detail(request, order_id):

    order = get_object_or_404(
        Order,
        id=order_id,
        user=request.user
    )

    items = OrderItem.objects.filter(
        order=order
    )

    return render(
        request,
        "order_detail.html",
        {
            "order": order,
            "items": items
        }
    )


# ============================================================
# CART
# ============================================================

def cart(request):

    return render(
        request,
        "cart.html"
    )


# ============================================================
# CHECKOUT
# ============================================================

@login_required(login_url="login")
def checkout(request):

    if request.method == "POST":

        form = OrderForm(request.POST)

        if form.is_valid():

            cart_data = request.POST.get(
                "cart_data",
                "[]"
            )

            try:

                cart_items = json.loads(
                    cart_data
                )

            except (
                json.JSONDecodeError,
                TypeError
            ):

                cart_items = []

            if not cart_items:

                return render(
                    request,
                    "checkout.html",
                    {
                        "form": form,
                        "cart_error":
                            "Your cart is empty."
                    }
                )

            subtotal = Decimal("0.00")

            # Calculate subtotal
            for item in cart_items:

                try:

                    price = Decimal(
                        str(
                            item.get(
                                "price",
                                0
                            )
                        )
                    )

                    quantity = int(
                        item.get(
                            "quantity",
                            1
                        )
                    )

                except (
                    ValueError,
                    TypeError
                ):

                    continue

                if quantity < 1:
                    quantity = 1

                subtotal += (
                    price * quantity
                )

            # Delivery fee
            delivery_fee = Decimal(
                "50.00"
            )

            total = (
                subtotal
                + delivery_fee
            )

            # Create order
            order = form.save(
                commit=False
            )

            order.user = request.user

            order.total_amount = total

            # Unique eSewa transaction UUID
            order.transaction_uuid = (
                str(uuid.uuid4())
            )

            order.payment_status = "Pending"

            order.save()

            # Create order items
            for item in cart_items:

                food_name = item.get(
                    "name",
                    "Unknown Food"
                )

                price = Decimal(
                    str(
                        item.get(
                            "price",
                            0
                        )
                    )
                )

                quantity = int(
                    item.get(
                        "quantity",
                        1
                    )
                )

                if quantity < 1:
                    quantity = 1

                item_total = (
                    price * quantity
                )

                OrderItem.objects.create(
                    order=order,
                    food_name=food_name,
                    price=price,
                    quantity=quantity,
                    total=item_total
                )

            # ========================================
            # CASH ON DELIVERY
            # ========================================

            if order.payment_method == "cod":

                return redirect(
                    "order_success"
                )

            # ========================================
            # ESEWA
            # ========================================

            if order.payment_method == "esewa":

                return redirect(
                    "esewa_payment",
                    order_id=order.id
                )

            # ========================================
            # KHALTI
            # ========================================

            return redirect(
                "order_success"
            )

    else:

        form = OrderForm()

    return render(
        request,
        "checkout.html",
        {
            "form": form
        }
    )


# ============================================================
# ESEWA SETTINGS
# ============================================================

ESEWA_PRODUCT_CODE = "EPAYTEST"

ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q"

ESEWA_PAYMENT_URL = (
    "https://rc-epay.esewa.com.np/"
    "api/epay/main/v2/form"
)

ESEWA_STATUS_URL = (
    "https://uat.esewa.com.np/"
    "api/epay/transaction/status/"
)


# ============================================================
# ESEWA SIGNATURE GENERATOR
# ============================================================

def generate_esewa_signature(
    total_amount,
    transaction_uuid,
    product_code
):

    message = (
        f"total_amount={total_amount},"
        f"transaction_uuid={transaction_uuid},"
        f"product_code={product_code}"
    )

    signature = hmac.new(
        ESEWA_SECRET_KEY.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256
    ).digest()

    return base64.b64encode(
        signature
    ).decode("utf-8")


# ============================================================
# ESEWA PAYMENT
# ============================================================

@login_required(login_url="login")
def esewa_payment(request, order_id):

    order = get_object_or_404(
        Order,
        id=order_id,
        user=request.user
    )

    total_amount = str(
        order.total_amount.quantize(
            Decimal("0.01")
        )
    )

    transaction_uuid = (
        order.transaction_uuid
    )

    product_code = (
        ESEWA_PRODUCT_CODE
    )

    signed_field_names = (
        "total_amount,"
        "transaction_uuid,"
        "product_code"
    )

    signature = generate_esewa_signature(
        total_amount,
        transaction_uuid,
        product_code
    )

    success_url = request.build_absolute_uri(
        reverse("esewa_success")
    )

    failure_url = request.build_absolute_uri(
        reverse("esewa_failure")
    )

    context = {

        "amount": total_amount,

        "tax_amount": "0",

        "total_amount": total_amount,

        "transaction_uuid":
            transaction_uuid,

        "product_code":
            product_code,

        "product_service_charge":
            "0",

        "product_delivery_charge":
            "0",

        "success_url":
            success_url,

        "failure_url":
            failure_url,

        "signed_field_names":
            signed_field_names,

        "signature":
            signature,

        "esewa_payment_url":
            ESEWA_PAYMENT_URL,
    }

    return render(
        request,
        "esewa_payment.html",
        context
    )


# ============================================================
# ESEWA SUCCESS
# ============================================================
@csrf_exempt
def esewa_success(request):

    encoded_data = request.GET.get(
        "data"
    )

    if not encoded_data:

        return render(
            request,
            "order_success.html",
            {
                "payment_error":
                    "eSewa response data was not received."
            }
        )

    # ----------------------------------------
    # Decode Base64 response
    # ----------------------------------------

    try:

        decoded_data = base64.b64decode(
            encoded_data
        ).decode("utf-8")

        response_data = json.loads(
            decoded_data
        )

    except (
        ValueError,
        UnicodeDecodeError,
        json.JSONDecodeError
    ):

        return render(
            request,
            "order_success.html",
            {
                "payment_error":
                    "Invalid eSewa response."
            }
        )

    # ----------------------------------------
    # Get response values
    # ----------------------------------------

    transaction_uuid = (
        response_data.get(
            "transaction_uuid"
        )
    )

    response_status = (
        response_data.get("status")
    )

    response_total = (
        response_data.get(
            "total_amount"
        )
    )

    response_product_code = (
        response_data.get(
            "product_code"
        )
    )

    response_signature = (
        response_data.get(
            "signature"
        )
    )

    if not transaction_uuid:

        return render(
            request,
            "order_success.html",
            {
                "payment_error":
                    "Transaction UUID is missing."
            }
        )

    # ----------------------------------------
    # Find order
    # ----------------------------------------

    order = get_object_or_404(
        Order,
        transaction_uuid=transaction_uuid
    )

    # ----------------------------------------
    # Product code validation
    # ----------------------------------------

    if response_product_code != ESEWA_PRODUCT_CODE:

        order.payment_status = "Failed"
        order.save(
            update_fields=["payment_status"]
        )

        return render(
            request,
            "order_success.html",
            {
                "order": order,
                "payment_error":
                    "Invalid eSewa product code."
            }
        )

    # ----------------------------------------
    # Amount validation
    # ----------------------------------------

    try:

        response_total_decimal = (
            Decimal(
                str(response_total)
            ).quantize(
                Decimal("0.01")
            )
        )

    except (
        ValueError,
        TypeError,
        ArithmeticError
    ):

        order.payment_status = "Failed"
        order.save(
            update_fields=["payment_status"]
        )

        return render(
            request,
            "order_success.html",
            {
                "order": order,
                "payment_error":
                    "Invalid payment amount."
            }
        )

    order_total_decimal = (
        order.total_amount.quantize(
            Decimal("0.01")
        )
    )

    if response_total_decimal != order_total_decimal:

        order.payment_status = "Failed"
        order.save(
            update_fields=["payment_status"]
        )

        return render(
            request,
            "order_success.html",
            {
                "order": order,
                "payment_error":
                    "Payment amount does not match the order amount."
            }
        )

    # ----------------------------------------
    # Verify callback signature
    # ----------------------------------------

    signed_field_names = (
        response_data.get(
            "signed_field_names"
        )
    )

    if (
        response_signature
        and signed_field_names
    ):

        signed_values = []

        for field_name in (
            signed_field_names.split(",")
        ):

            value = response_data.get(
                field_name,
                ""
            )

            signed_values.append(
                f"{field_name}={value}"
            )

        signed_message = ",".join(
            signed_values
        )

        expected_signature = base64.b64encode(
            hmac.new(
                ESEWA_SECRET_KEY.encode(
                    "utf-8"
                ),
                signed_message.encode(
                    "utf-8"
                ),
                hashlib.sha256
            ).digest()
        ).decode("utf-8")

        if not hmac.compare_digest(
            response_signature,
            expected_signature
        ):

            order.payment_status = "Failed"

            order.save(
                update_fields=[
                    "payment_status"
                ]
            )

            return render(
                request,
                "order_success.html",
                {
                    "order": order,
                    "payment_error":
                        "eSewa signature verification failed."
                }
            )

    # ----------------------------------------
    # Check callback status
    # ----------------------------------------

    if response_status != "COMPLETE":

        order.payment_status = "Failed"

        order.save(
            update_fields=[
                "payment_status"
            ]
        )

        return render(
            request,
            "order_success.html",
            {
                "order": order,
                "payment_error":
                    "eSewa payment was not completed."
            }
        )

    # ----------------------------------------
    # Verify transaction with eSewa API
    # ----------------------------------------

    try:

        verification_response = requests.get(
            ESEWA_STATUS_URL,
            params={
                "product_code":
                    ESEWA_PRODUCT_CODE,

                "total_amount":
                    str(order_total_decimal),

                "transaction_uuid":
                    transaction_uuid,
            },
            timeout=15
        )

        verification_response.raise_for_status()

        verification_data = (
            verification_response.json()
        )
        

    except (
        requests.RequestException,
        ValueError
    ):

        return render(
            request,
            "order_success.html",
            {
                "order": order,
                "payment_error":
                    "Could not verify the payment with eSewa. Please try again."
            }
        )

    # ----------------------------------------
    # Final verification
    # ----------------------------------------

    verified_status = (
        verification_data.get(
            "status"
        )
    )

    verified_product_code = (
        verification_data.get(
            "product_code"
        )
    )

    verified_transaction_uuid = (
        verification_data.get(
            "transaction_uuid"
        )
    )

    if (
        verified_status == "COMPLETE"
        and verified_product_code
        == ESEWA_PRODUCT_CODE
        and str(
            verified_transaction_uuid
        )
        == str(transaction_uuid)
    ):

        order.payment_status = "Completed"

        order.save(
            update_fields=[
                "payment_status"
            ]
        )

        return render(
            request,
            "order_success.html",
            {
                "order": order
            }
        )

    # ----------------------------------------
    # Verification failed
    # ----------------------------------------

    order.payment_status = "Failed"

    order.save(
        update_fields=[
            "payment_status"
        ]
    )

    return render(
        request,
        "order_success.html",
        {
            "order": order,
            "payment_error":
                "eSewa transaction verification failed."
        }
    )


# ============================================================
# ESEWA FAILURE
# ============================================================

def esewa_failure(request):

    transaction_uuid = request.GET.get(
        "transaction_uuid"
    )

    order = None

    if transaction_uuid:

        order = Order.objects.filter(
            transaction_uuid=transaction_uuid
        ).first()

        if order:

            order.payment_status = "Failed"

            order.save(
                update_fields=[
                    "payment_status"
                ]
            )

    return render(
        request,
        "order_success.html",
        {
            "order": order,
            "payment_error":
                "eSewa payment was cancelled or failed."
        }
    )


# ============================================================
# ORDER SUCCESS
# ============================================================

@login_required(login_url="login")
def order_success(request):

    order = (
        Order.objects
        .filter(user=request.user)
        .order_by("-id")
        .first()
    )

    return render(
        request,
        "order_success.html",
        {
            "order": order
        }
    )


# ============================================================
# LOGIN
# ============================================================

def user_login(request):

    if request.user.is_authenticated:

        return redirect(
            "dashboard"
        )

    form = LoginForm(
        request.POST or None
    )

    if request.method == "POST":

        if form.is_valid():

            username = (
                form.cleaned_data[
                    "username"
                ]
            )

            password = (
                form.cleaned_data[
                    "password"
                ]
            )

            user = authenticate(
                request,
                username=username,
                password=password
            )

            if user is not None:

                login(
                    request,
                    user
                )

                return redirect(
                    "dashboard"
                )

            form.add_error(
                None,
                "Username or password is incorrect."
            )

    return render(
        request,
        "login.html",
        {
            "form": form
        }
    )


# ============================================================
# REGISTER
# ============================================================

def register(request):

    if request.user.is_authenticated:

        return redirect(
            "dashboard"
        )

    form = RegisterForm(
        request.POST or None
    )

    if request.method == "POST":

        if form.is_valid():

            form.save()

            messages.success(
                request,
                "Account created successfully. Please login."
            )

            return redirect(
                "login"
            )

    return render(
        request,
        "register.html",
        {
            "form": form
        }
    )


# ============================================================
# USER DASHBOARD
# ============================================================

@login_required(login_url="login")
def dashboard(request):

    orders = (
        Order.objects
        .filter(user=request.user)
        .order_by("-created_at")
    )

    context = {

        "orders": orders,

        "total_orders":
            orders.count(),

        "pending_orders":
            orders.filter(
                status="Pending"
            ).count(),

        "preparing_orders":
            orders.filter(
                status="Preparing"
            ).count(),

        "delivered_orders":
            orders.filter(
                status="Delivered"
            ).count(),

        "recent_orders":
            orders[:5],
    }

    return render(
        request,
        "dashboard.html",
        context
    )


# ============================================================
# LOGOUT
# ============================================================

def user_logout(request):

    logout(request)

    return redirect(
        "login"
    )


# ============================================================
# ADMIN FOOD LIST
# ============================================================

@user_passes_test(
    admin_required,
    login_url="login"
)
def admin_foods(request):

    foods = (
        Food.objects
        .all()
        .order_by("-id")
    )

    return render(
        request,
        "admin_foods.html",
        {
            "foods": foods
        }
    )


# ============================================================
# ADMIN CATEGORY LIST
# ============================================================

@user_passes_test(
    admin_required,
    login_url="login"
)
def admin_categories(request):

    categories = (
        Category.objects
        .all()
        .order_by("-id")
    )

    return render(
        request,
        "admin_categories.html",
        {
            "categories": categories
        }
    )


# ============================================================
# ADMIN USER LIST
# ============================================================

@user_passes_test(
    admin_required,
    login_url="login"
)
def admin_users(request):

    users = (
        User.objects
        .all()
        .order_by("-id")
    )

    return render(
        request,
        "admin_users.html",
        {
            "users": users
        }
    )