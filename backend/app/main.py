from fastapi import FastAPi


app = FastAPi()




@app.get("/")
def root():
    return {"msg" : "Hello World"}