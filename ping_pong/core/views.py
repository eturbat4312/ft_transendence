from django.shortcuts import render, redirect
from score.models import Score, Game
from .forms import SignUpForm


def index(request):
    games = Game.objects.all()
    return render(
        request,
        "core/index.html",
        {
            "games": games,
        },
    )


def signup(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)

        if form.is_valid():
            form.save()

            return redirect("/login/")
    else:
        form = SignUpForm()

    return render(request, "core/signup.html", {"form": form})
