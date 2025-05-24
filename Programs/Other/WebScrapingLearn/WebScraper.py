import requests
import bs4
import pandas as pd
import lxml

url = "https://www.worldometers.info/water/access-to-safe-water/"

result = requests.get(url)

soup = bs4.BeautifulSoup(result.text,"lxml")

cases = soup.find_all("span", class_= "rts-counter")

data = []

for i in cases:
    span = i.find("span")
    print( )
    # data.append(span.string)

print(data)

df = pd.DataFrame({"WaterData" : data})

df.index = ["cases"]

df.to_csv("water-data.csv")