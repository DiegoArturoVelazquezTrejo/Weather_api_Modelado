import pandas as pd

#Leemos la base de datos que se descargó del perfil: https://github.com/datasets/airport-codes
data = pd.read_csv("airport-codes.csv");
# Creamos un dataframe con los datos
df = pd.DataFrame(data)
# Nos quedamos unicamente con los datos que necesitamos y que sean distintos de None
a = df.dropna()
# Guardamos el resultado
a.to_csv('aeropuertosMundiales.csv')
