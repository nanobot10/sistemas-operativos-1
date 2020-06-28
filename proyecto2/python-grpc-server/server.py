import grpc
from concurrent import futures
import time

# import the generated classes
import calculator_pb2
import calculator_pb2_grpc

# import the original calculator.py
import calculator
import pymongo
import redis
import json

myclient = pymongo.MongoClient("mongodb://35.202.133.187:27017/")
mydb = myclient["proyecto"]
mycol = mydb["infectados"]

r = redis.Redis(host='35.202.133.187',port=6379,password='',db = '15')

# create a class to define the server functions, derived from
# calculator_pb2_grpc.CalculatorServicer
class CalculatorServicer(calculator_pb2_grpc.CalculatorServicer):

    # calculator.square_root is exposed here
    # the request and response are of the data type
    # calculator_pb2.Number
    def SquareRoot(self, request, context):
        record = {"nombre": request.nombre, "departamento":request.departamento,"edad":request.edad,"Forma de contagio":request.formaDeContagio,"estado":request.estado}
        redisRecord = {"nombre": request.nombre, "departamento":request.departamento,"edad":request.edad,"Forma de contagio":request.formaDeContagio,"estado":request.estado}
        try:
            x = mycol.insert_one(record)
            print(x.inserted_id)
            r.lpush('casoscovid',json.dumps(redisRecord,sort_keys=True))
        except Exception as err:
            print(err)
        response = calculator_pb2.Number()
        response.nombre = request.nombre
        return response


# create a gRPC server
server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))

# use the generated function `add_CalculatorServicer_to_server`
# to add the defined class to the server
calculator_pb2_grpc.add_CalculatorServicer_to_server(
        CalculatorServicer(), server)

# listen on port 50051
print('Starting server. Listening on port 50051.')
server.add_insecure_port('[::]:50051')
server.start()

# since server.start() will not block,
# a sleep-loop is added to keep alive
try:
    while True:
        time.sleep(86400)
except KeyboardInterrupt:
    server.stop(0)