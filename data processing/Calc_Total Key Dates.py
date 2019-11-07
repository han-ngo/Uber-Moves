import csv
import pandas as pd 
   
# Define a dictionary containing employee data 
data = pd.read_csv("C:\Users\c10333\Documents\Data Visualization\Project\uber-raw-data-apr14 _v1.csv")

# Convert the dictionary into DataFrame  
df = pd.DataFrame(data) 
weight=[]
print len(weight)
print "starting"
for index, row in df.iterrows():
    weight.append(df[df.key == df.loc[index]['key']].shape[0])

print "insert"
  
df.insert(3, "total_same_keys", weight, True)
  
print df
export_csv = df.to_csv (r'C:\Users\c10333\Documents\Data Visualization\Project\export_dataframe1.csv', index = None, header=True) #Don't forget to add '.csv' at the end of the path


# print df[df.key == df.loc[0]['key']].shape[0]
     
  


        
    
