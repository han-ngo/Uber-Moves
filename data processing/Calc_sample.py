import csv
import pandas as pd 
   
# Define a dictionary containing employee data 
data = pd.read_csv("C:\Users\c10333\Documents\Data Visualization\Project\uber-raw-data-apr14_v2.csv")

# Convert the dictionary into DataFrame  
df = pd.DataFrame(data)

print "getting weights from excel"

test_weights = list(df['Weight'])

print "sampling"


sample = df.sample(n = 10000, weights = test_weights)
  
print sample

export_csv = sample.to_csv (r'C:\Users\c10333\Documents\Data Visualization\Project\uber-raw-data-apr14_v3', index = None, header=True) #Don't forget to add '.csv' at the end of the path


     
  


        
    
