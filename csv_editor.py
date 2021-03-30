import pandas as pd
import csv

df_read = pd.read_csv("~/course/cs1951/hw6/data/football.csv")

year_dict = {"1970": 0, "1980": 0, "1990": 0, "2000": 0, "2010": 0}

year_dict2 = {"2015": 0, "2016": 0, "2017": 0, "2018": 0, "2019": 0}

team_wins_dict = {}

team_total_dict = {}

team_total_goals_WC = {}



for row_tuple in df_read.iterrows():

    row = row_tuple[1]
    

    ##date = row['date']
    date = row[0]
    date = str(date)
    date_split = date.split("-")
    year = date_split[0]

    if(year == "1970"):
        year_dict["1970"] = year_dict["1970"] + 1
    

    if(year == "1980"):
        year_dict["1980"] = year_dict["1980"] + 1
    

    if(year == "1990"):
        year_dict["1990"] = year_dict["1990"] + 1
    

    if(year == "2000"):
        year_dict["2000"] = year_dict["2000"] + 1
    

    if(year == "2010"):
        year_dict["2010"] = year_dict["2010"] + 1




    ## second year data set

    if(year == "2017"):
        year_dict2["2017"] = year_dict2["2017"] + 1
    

    if(year == "2019"):
        year_dict2["2019"] = year_dict2["2019"] + 1
    

    if(year == "2018"):
        year_dict2["2018"] = year_dict2["2018"] + 1
    

    if(year == "2016"):
        year_dict2["2016"] = year_dict2["2016"] + 1
    

    if(year == "2015"):
        year_dict2["2015"] = year_dict2["2015"] + 1
    



    ##home_team = row['home_team']
    home_team = row[1]

    ##away_team = row['away_team']
    away_team = row[2]

    home_score = row[3]

    away_score = row[4]

    tournament = row[5]


    if home_team in team_total_dict:
        team_total_dict[home_team] = team_total_dict[home_team] + 1
    else:
        team_total_dict[home_team] = 1
    
    if away_team in team_total_dict:
        team_total_dict[away_team] = team_total_dict[away_team] + 1
    else:
        team_total_dict[away_team] = 1

    

        

    ##team_total_dict[home_team] = team_total_dict[home_team] + 1

    team_total_dict[away_team] = team_total_dict[away_team] + 1

    if home_score > away_score:

        if home_team in team_wins_dict:

            team_wins_dict[home_team] = team_wins_dict[home_team] + 1
        else:

            team_wins_dict[home_team] = 1

    if away_score > home_score:

        if away_team in team_wins_dict:

            team_wins_dict[away_team] = team_wins_dict[away_team] + 1
        else:

            team_wins_dict[away_team] = 1



    if (year == "2018" or year == "2014") and tournament == "FIFA World Cup":

        if home_team in team_total_goals_WC:
            team_total_goals_WC[home_team] = team_total_goals_WC[home_team] + home_score
        else:
            team_total_goals_WC[home_team] = home_score

        if away_team in team_total_goals_WC:
            team_total_goals_WC[away_team] = team_total_goals_WC[away_team] + away_score
        else:
            team_total_goals_WC[away_team] = away_score
        

team_winning_percentage = []


# print("printing all data info: ")
# print("\n\n")

# print("printing year dict: ")
# print("\n\n")
# print(year_dict)

# print("printing team wins dict: ")
# print("\n\n")
# print(team_wins_dict)

# print("printing team total dict: ")
# print("\n\n")
# print(team_total_dict)

for key in team_wins_dict:

    

    winning_percentage = team_wins_dict[key] / team_total_dict[key]
    team_winning_percentage.append([key, winning_percentage, team_wins_dict[key], team_total_dict[key]])

print("the team winning percentage looks like this: ")
print(team_winning_percentage)
print("\n\n")

##team_winning_percentage = team_winning_percentage.sort(key = lambda x: x[1])
team_winning_percentage = sorted(team_winning_percentage, key = lambda x: x[1], reverse= True)


print("the team winning percentage after sorting looks like this: ")
print(team_winning_percentage)
print("\n\n")

team_winning_percentage = team_winning_percentage[:10]

print("final winning percentage data is: ")
print(team_winning_percentage)
print("\n\n")

print("final WC goal data is: ")
print(team_total_goals_WC)
print("\n\n")

team_total_goals_WC_list = []

for key in team_total_goals_WC:

    

    goals_total = team_total_goals_WC[key]
    team_total_goals_WC_list.append((key, goals_total))

team_total_goals_WC_list = sorted(team_total_goals_WC_list, key = lambda x: x[1], reverse= True)

print("final WC goal data list, sorted, is: ")
print(team_total_goals_WC_list)
print("\n\n")

print("final WC goal data list, sorted, is: ")
print(team_total_goals_WC_list)
print("\n\n")

print("final recent year data is: ")
print(year_dict2)
print("\n\n")



# with open('years_games.csv', 'w', newline='') as file:
#     writer = csv.writer(file)

#     writer.writerow(["SN", "year", "count"])
#     writer.writerow([1, "1970", year_dict["1970"]])
#     writer.writerow([2, "1980", year_dict["1980"]])
#     writer.writerow([3, "1990", year_dict["1990"]])
#     writer.writerow([4, "2000", year_dict["2000"]])
#     writer.writerow([5, "2010", year_dict["2010"]])

with open('winning_percentages.csv', 'w', newline='') as file:
    writer = csv.writer(file)

    writer.writerow(["SN", "Team", "Percentage", "Wins", "Total"])

    counter = 1

    for team_percent_pair in team_winning_percentage:
        writer.writerow([counter, team_percent_pair[0], team_percent_pair[1], team_percent_pair[2], team_percent_pair[3]])
        counter = counter + 1

# with open('goal_totals.csv', 'w', newline='') as file:
#     writer = csv.writer(file)

#     writer.writerow(["SN", "Team", "Goals"])

#     counter = 1

#     for team_goal_pair in team_total_goals_WC_list:
#         writer.writerow([counter, team_goal_pair[0], team_goal_pair[1]])
#         counter = counter + 1

# with open('recent_years_games.csv', 'w', newline='') as file:
#     writer = csv.writer(file)

#     writer.writerow(["SN", "year", "count"])
#     writer.writerow([1, "2015", year_dict2["2015"]])
#     writer.writerow([2, "2016", year_dict2["2016"]])
#     writer.writerow([3, "2017", year_dict2["2017"]])
#     writer.writerow([4, "2018", year_dict2["2018"]])
#     writer.writerow([5, "2019", year_dict2["2019"]])


