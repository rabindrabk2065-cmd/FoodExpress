from django.db import models
from django.contrib.auth.models import User


class Order(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders',
        null=True,
        blank=True
    )

    PAYMENT_CHOICES = [
        ('cod', 'Cash on Delivery'),
        ('esewa', 'eSewa'),
        ('khalti', 'Khalti'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Preparing', 'Preparing'),
        ('Out for Delivery', 'Out for Delivery'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    name = models.CharField(
        max_length=100
    )

    phone = models.CharField(
        max_length=15
    )       

    email = models.EmailField()

    address = models.TextField()

    city = models.CharField(
        max_length=100
    )

    landmark = models.CharField(
        max_length=200,
        blank=True
    )

    note = models.TextField(
        blank=True
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    # Payment status
    payment_status = models.CharField(
        max_length=20,
        default="Pending"
    )

    # eSewa transaction UUID
    transaction_uuid = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        unique=True
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='Pending'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Order #{self.id} - {self.name}"


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )

    food_name = models.CharField(
        max_length=200
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return f"{self.food_name} x {self.quantity}"

class Category(models.Model):

    name = models.CharField(
        max_length=50
    )

    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name


class Food(models.Model):

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='foods',
        null=True,
        blank=True
    )

    name = models.CharField(
        max_length=50
    )

    image = models.ImageField(
        upload_to='foods/',
        blank=True,
        null=True
    )

    description = models.CharField(
        max_length=100
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    rating = models.FloatField(
        default=0
    )

    def __str__(self):
        return self.name


class Home(models.Model):

    image = models.ImageField(
        upload_to='home_images/',
        blank=True,
        null=True
    )

    def __str__(self):
        return "Home Image"

class ContactInfo(models.Model):

    business_name = models.CharField(
        max_length=100,
        default="FoodExpress"
    )

    phone = models.CharField(
        max_length=20
    )

    email = models.EmailField(
        max_length=100
    )

    address = models.CharField(
        max_length=200
    )

    opening_hours = models.CharField(
        max_length=100
    )

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.business_name

  