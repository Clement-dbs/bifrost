import datetime as dt
import time

from scheduler import Scheduler


def foo():
    print("foo")


schedule = Scheduler()

schedule.cyclic(dt.timedelta(seconds=10), foo)

schedule.minutely(dt.time(second=15), foo)
schedule.hourly(dt.time(minute=30, second=15), foo)
schedule.daily(dt.time(hour=16, minute=30), foo)

while True:
    schedule.exec_jobs()
    time.sleep(1)