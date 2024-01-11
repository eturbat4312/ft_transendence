from django.shortcuts import render, redirect

from .forms import SignupForm
from django.contrib.auth.models import User


# Create your views here.
def home(request):
    return render(request, "home.html")


def signup(request):
    if request.method == "POST":
        form = SignupForm(request.POST, request.FILES)
        if form.is_valid():
            username = form.cleaned_data["username"]
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password1"]
            avatar = request.FILES.get("avatar")

            if avatar:
                if avatar.size > 4 * 1024 * 1024:
                    form.add_error("avatar", "Avatar image is too large")
                elif not avatar.content_type.startswith("image/"):
                    form.add_error("avatar", "File must be an image")

            if not form.errors:
                user = User.objects.create_user(username, email, password)

                if avatar:
                    user.avatar.save(f"{user.pk}_{avatar.name}", avatar)
                else:
                    user.avatar = "default_avatar.png"

                user.save()
                return redirect("/login/")

    else:
        form = SignupForm()

    context = {"form": form}
    return render(request, "signup.html", context)
