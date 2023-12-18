from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

def index(request):
    context = {}
    template = loader.get_template('appli/index.html')
    return HttpResponse(template.render(context, request))
def register(request):
    context = {}
    template = loader.get_template('appli/register.html')
    return HttpResponse(template.render(context, request))
def game(request):
    context = {}
    template = loader.get_template('appli/game.html')
    return HttpResponse(template.render(context, request))
