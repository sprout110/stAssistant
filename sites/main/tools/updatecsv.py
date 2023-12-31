import pandas as pd 
 
def addRate(userId, eventId, rating):
    # Creating the first Dataframe using dictionary 
    isThere = False
 
    # Creating the first Dataframe using dictionary 
    df1 = pd.read_csv('./rating.csv')
 
    try:
        userInt = int(userId)
        eventInt = int(eventId)
        ratingInt = int(rating)
        # print(userInt,eventInt,ratingInt)
        
        if(0>ratingInt or ratingInt>5):
           invalid = "invalid"
           return invalid

    except ValueError:
        error = "error"
        return error

    for index, row in df1.iterrows():  
        if str(row['event-id']) == str(eventId) and str(row['user-id']) == str(userId):
            df1.loc[index,'rating'] = rating
            isThere = True
    
     
    if isThere != True: 
        # Creating the Second Dataframe using dictionary
        rate = {
            "user-id":[userId], 
            "event-id":[eventId], 
            "rating":[rating]
        }

        dff = pd.concat([df1, pd.DataFrame(rate)], ignore_index=True)
        dff.to_csv(r'./rating.csv', index = False)

        add = "added"
        return add

    else:
        
        df1.to_csv(r'./rating.csv', index = False) 
        update = "updated"
        return update
