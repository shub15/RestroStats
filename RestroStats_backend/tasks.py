from celery import Celery
from model_training import train_model_incrementally

app = Celery('tasks', broker='redis://localhost:6379/0')

@app.task
def scheduled_training():
    train_model_incrementally()
