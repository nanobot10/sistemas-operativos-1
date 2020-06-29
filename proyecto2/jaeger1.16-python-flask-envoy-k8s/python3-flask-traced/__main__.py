import asyncio
import os
import signal
import json
import pymongo
import redis
import flask
import requests
import opentelemetry.ext.requests

from opentelemetry import trace
from opentelemetry.ext import jaeger
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import ConsoleSpanExporter
from opentelemetry.sdk.trace.export import SimpleExportSpanProcessor
from opentelemetry.ext.flask import FlaskInstrumentor
from nats.aio.client import Client as NATS


myclient = pymongo.MongoClient("mongodb://10.128.0.3:27017/")
mydb = myclient["proyecto"]
mycol = mydb["infectados"]

r = redis.Redis(host='10.128.0.3',port=6379,password='',db = '15')

jaeger_exporter = jaeger.JaegerSpanExporter(
    service_name="my-traced-service", agent_host_name="simplest-agent.proyecto.svc.cluster.local", agent_port=6831
)

trace.set_tracer_provider(TracerProvider())
trace.get_tracer_provider().add_span_processor(
    SimpleExportSpanProcessor(jaeger_exporter)
)

async def run(loop):
    nc = NATS()

    async def closed_cb():
        print("Connection to NATS is closed.")
        await asyncio.sleep(0.1, loop=loop)
        loop.stop()

    # It is very likely that the demo server will see traffic from clients other than yours.
    # To avoid this, start your own locally and modify the example to use it.
    options = {
        # "servers": ["nats://127.0.0.1:4222"],
        "servers": ["nats://10.128.0.6:4222"],
        "loop": loop,
        "closed_cb": closed_cb
    }

    await nc.connect(**options)
    print(f"Connected to NATS at {nc.connected_url.netloc}...")

    async def subscribe_handler(msg):
        subject = msg.subject
        reply = msg.reply
        data = json.loads(msg.data.decode())
        x = mycol.insert_one(data)
        StringData = msg.data.decode('utf-8')
        r.lpush('casoscovid',StringData)
        print("Received a message on '{subject} {reply}': {data}".format(
            subject=subject, reply=reply, data=data))
        tracer = trace.get_tracer(__name__)
        with tracer.start_as_current_span("step1"):
            with tracer.start_as_current_span("se recibió mensaje desde nats"):
        #with tracer.start_as_current_span(data):
        #with tracer.start_as_current_span("se ha insertado en mongo"):
        #with tracer.start_as_current_span(x.inserted_id):
        #with tracer.start_as_current_span("se ha insertado en redis"):
                requests.get("http://www.google.com")
       #     with tracer.start_as_current_span("step2"):
       #         requests.get("http://www.google.com")

    # Basic subscription to receive all published messages
    # which are being sent to a single topic 'discover'
    await nc.subscribe("foo", cb=subscribe_handler)

    # Subscription on queue named 'workers' so that
    # one subscriber handles message a request at a time.
    await nc.subscribe("foo.*", "workers", subscribe_handler)

    def signal_handler():
        if nc.is_closed:
            return
        print("Disconnecting...")
        loop.create_task(nc.close())

    for sig in ('SIGINT', 'SIGTERM'):
        loop.add_signal_handler(getattr(signal, sig), signal_handler)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run(loop))
    try:
        loop.run_forever()
    finally:
        loop.close()

