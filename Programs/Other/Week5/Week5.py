from urllib.request import urlopen

from bs4 import BeautifulSoup

import pandas as pd 


html = urlopen('https://en.wikipedia.org/wiki/Main_Page')

bs = BeautifulSoup(html, "html.parser")

title = bs.find_all("h2")

titles = []
for i in title:
    x = i.find("span").text
    titles.append(x)

print(titles)

df = pd.DataFrame({"titles":titles}) 
  
df.to_csv('titles.tsv', sep="\t") 