from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),   
    path('chowmein/', views.chowmein, name='chowmein'),
    path('momo/', views.momo, name='momo'),
    path('restaurants/', views.restaurants, name='restaurants'),
    path('food/', views.food, name='food'),
    path('cart/', views.cart, name='cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('order-success/', views.order_success, name='order_success'),
    path(
    "food-category/<int:category_id>/",
    views.category_detail,
    name="category_detail"
),
path(
    "order/<int:order_id>/",
    views.order_detail,
    name="order_detail"
),

    # Authentication

    path("login/", views.user_login, name="login"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("logout/", views.user_logout, name="logout"),
    path("register/", views.register, name="register"),

    path(
    "admin-panel/",
    views.admin_dashboard,
    name="admin_dashboard"
),
path(
    "admin-panel/orders/",
    views.admin_orders,
    name="admin_orders"
),

path(
    "admin-panel/orders/<int:order_id>/",
    views.admin_order_detail,
    name="admin_order_detail"
),
path("admin-panel/foods/", views.admin_foods, name="admin_foods"),
path("admin-panel/categories/", views.admin_categories, name="admin_categories"),
path("admin-panel/users/", views.admin_users, name="admin_users"),

  #esewa payment
path(
        "esewa/payment/<int:order_id>/",
        views.esewa_payment,
        name="esewa_payment"
    ),

    path(
        "esewa/success/",
        views.esewa_success,
        name="esewa_success"
    ),

    path(
        "esewa/failure/",
        views.esewa_failure,
        name="esewa_failure"
    ),
]