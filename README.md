# Spotify - Songkick - Opencage Mashup

This Mashup was an assignment completed for Cloud Computing (CAB432) that required a mashup entailing a 3 different APIs that depend on the data received from one another. The project retrieves the users top short term Spotify artists then displays a list of all of these artists upcoming Australian shows with links to either display the location of the venue on a map, or redirect users to an the appropriate website to purchase tickets. This project was developed using Express and Pug server side rendering. 

![success](https://user-images.githubusercontent.com/60918924/108790912-8da1ce80-75c9-11eb-954a-2393c54cc4eb.JPG)


## Local Host Deployment 
   1. Run 'npm install' 
   1. Create a .env file at the top level
   1. The file will have the following structure

        ###### SPOTIFY_CLIENT_ID= ________________
        ###### SPOTIFY_SECRET= ________________
        ###### SPOTIFY_REDIRECT_URI= http://localhost:3000/authenticated
        ###### SONGKICK_KEY = ________________
        ###### OCD_API_KEY = ________________

  1. Run 'npm start'

Access the application on localhost:3000
        
#### **Important**
To run the application the user will have to register the application with all of the appropriate endpoints to gain API access keys

[Spotify](https://developer.spotify.com/documentation/web-api/quick-start/)

[Songkick](https://www.songkick.com/api_key_requests/new)

[OpenCage](https://opencagedata.com/)
