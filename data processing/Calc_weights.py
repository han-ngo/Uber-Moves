import csv
import pandas as pd 
   
# Define a dictionary containing employee data 
data = pd.read_csv("C:\Users\c10333\Documents\Data Visualization\Project\uber-raw-data-apr14_v1.csv")

# Convert the dictionary into DataFrame  
df = pd.DataFrame(data) 
weight=[]
print len(weight)
print "starting"
for index, row in df.iterrows():
      weight.append((df.loc[index]['total_same_keys']*100) / float(564516))
    
   
print "insert"
  
df.insert(10000, "Weight", weight, True)
  
print df
export_csv = df.to_csv (r'C:\Users\c10333\Documents\Data Visualization\Project\uber-raw-data-apr14_v2', index = None, header=True) #Don't forget to add '.csv' at the end of the path


     
  


        
    
