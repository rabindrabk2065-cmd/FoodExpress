from django.contrib import admin
from .models import Order, OrderItem, Food,Category,Home, ContactInfo


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'name',
        'phone',
        'payment_method',
        'total_amount',
        'status',
        'created_at',
    )

    list_filter = (
        'status',
        'payment_method',
        'created_at',
    )

    search_fields = (
        'name',
        'phone',
        'email',
    )

    readonly_fields = (
        'created_at',
    )

    inlines = [
        OrderItemInline
    ]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        'food_name',
        'price',
        'quantity',
        'total',
        'order',
    )

    search_fields = (
        'food_name',
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "image")


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "rating",
    )

    list_filter = ("category",)

    search_fields = ("name", "description")
admin.site.register(Home)

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):

    list_display = (
        "business_name",
        "phone",
        "email",
        "address",
        "opening_hours",
    )

    search_fields = (
        "business_name",
        "phone",
        "email",
        "address",
    )
