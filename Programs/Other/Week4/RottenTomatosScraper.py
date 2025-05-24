import requests
import pandas as pd
import bs4
import lxml

url = "https://editorial.rottentomatoes.com/guide/best-movies-of-2023/"

result = requests.get(url)

result = bs4.BeautifulSoup(result.text, "lxml")

cases = result.find_all("div", class_ = "article_movie_title")

results = []

for i in cases:
   title = i.find("a") 
   title = title.text
   rating = i.find("span", class_ = "tMeterScore")
   rating = rating.text
   
   tup = (title, rating)
   results.append(tup)


df = pd.DataFrame({"Top Rotten Tomatos Ratings" : results})

df.to_csv("tomatoRatings.csv")
    


