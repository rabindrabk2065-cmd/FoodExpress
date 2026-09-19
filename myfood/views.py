import json
from decimal import Decimal

from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.db.models import Sum
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Order, OrderItem, Food, Category, Home, ContactInfo
from .forms import OrderForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, RegisterForm

def admin_required(user):
    return user.is_staff


@user_passes_test(
    admin_required,
    login_url="login"
)
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

    total_sales = Order.objects.filter(
        status="Delivered"
    ).aggregate(
        total=Sum("total_amount")
    )["total"] or 0

    recent_orders = Order.objects.select_related(
        "user"
    ).order_by("-created_at")[:10]

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
@user_passes_test(
    admin_required,
    login_url="login"
)
def admin_orders(request):

    orders = Order.objects.select_related(
        "user"
    ).order_by("-created_at")

    return render(
        request,
        "admin_orders.html",
        {
            "orders": orders,
        }
    )
@user_passes_test(
    admin_required,
    login_url="login"
)
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
            order.save(update_fields=["status"])

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

def home(request):
    home = Home.objects.first()

    return render(request, "home.html", {"home": home})

def contact(request):
    contact_info = ContactInfo.objects.first()

    return render(
        request,
        "contact.html",
        {
            "contact_info": contact_info
        }
    )


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


def momo(request):
    foods = Food.objects.filter(
        category__name__iexact="Momo"
    )

    return render(request,"momo.html",{"foods": foods})


def restaurants(request):
    return render(request, "restaurants.html")


def food(request):
    categories = Category.objects.all()

    return render(
        request,
        "food.html",
        {
            "categories": categories
        }
    )
def category_detail(request, category_id):
    category = Category.objects.get(id=category_id)

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
            "items": items,
        }
    )


def cart(request):
    return render(request, "cart.html")

@login_required(login_url="login")
def checkout(request):

    if request.method == "POST":

        form = OrderForm(request.POST)

        if form.is_valid():

            cart_data = request.POST.get("cart_data")

            try:
                cart = json.loads(cart_data)
            except (json.JSONDecodeError, TypeError):
                cart = []

            if not cart:
                return render(
                    request,
                    "checkout.html",
                    {
                        "form": form,
                        "cart_error": "Your cart is empty."
                    }
                )

            subtotal = Decimal("0.00")

            for item in cart:

                price = Decimal(
                    str(item.get("price", 0))
                )

                quantity = int(
                    item.get("quantity", 1)
                )

                subtotal += price * quantity

            delivery_fee = Decimal("50.00")
            total = subtotal + delivery_fee

            order = form.save(commit=False)

            order.user = request.user
            order.total_amount = total

            order.save()

            for item in cart:

                food_name = item.get(
                    "name",
                    "Unknown Food"
                )

                price = Decimal(
                    str(item.get("price", 0))
                )

                quantity = int(
                    item.get("quantity", 1)
                )

                item_total = price * quantity

                OrderItem.objects.create(
                    order=order,
                    food_name=food_name,
                    price=price,
                    quantity=quantity,
                    total=item_total
                )

            return redirect("order_success")

    else:
        form = OrderForm()

    return render(
        request,
        "checkout.html",
        {
            "form": form
        }
    )




def order_success(request):

    order = Order.objects.order_by("-id").first()

    return render(
        request,
        "order_success.html",
        {
            "order": order
        }
    )


def user_login(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    form = LoginForm(request.POST or None)

    if request.method == "POST":
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]

            user = authenticate(
                request,
                username=username,
                password=password
            )

            if user is not None:
                login(request, user)
                return redirect("dashboard")

            form.add_error(
                None,
                "Username or password is incorrect."
            )

    return render(
        request,
        "login.html",
        {"form": form}
    )


def register(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    form = RegisterForm(request.POST or None)

    if request.method == "POST":
        if form.is_valid():
            form.save()
            return redirect("login")

    return render(
        request,
        "register.html",
        {"form": form}
    )

@login_required(login_url="login")
def dashboard(request):
    orders = Order.objects.filter(
        user=request.user
    ).order_by("-created_at")

    context = {
        "orders": orders,
        "total_orders": orders.count(),
        "pending_orders": orders.filter(
            status="Pending"
        ).count(),
        "preparing_orders": orders.filter(
            status="Preparing"
        ).count(),
        "delivered_orders": orders.filter(
            status="Delivered"
        ).count(),
        "recent_orders": orders[:5],
    }

    return render(
        request,
        "dashboard.html",
        context
    )


def user_logout(request):
    logout(request)
    return redirect("login")

# admin site ko food list view
def admin_foods(request):
    foods = Food.objects.all().order_by('-id')

    return render(
        request,
        "admin_foods.html",
        {
            "foods": foods
        }
    )
def admin_categories(request):
    categories = Category.objects.all().order_by("-id")

    return render(
        request,
        "admin_categories.html",
        {
            "categories": categories
        }
    )


def admin_users(request):
    users = User.objects.all().order_by("-id")

    return render(
        request,
        "admin_users.html",
        {
            "users": users
        }
    )