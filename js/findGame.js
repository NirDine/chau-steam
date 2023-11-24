$(document).ready(function() {
    $('.searchButton').on('click', function() {
        var userInput = $('.searchInput').val();
        
        $.ajax({
            url: 'data/SteamIDs.min.json', // Replace with the path to your local JSON file
            dataType: 'json',
            success: function(data) {
                var appID = findAppID(userInput, data);
                if (appID !== null) {
                    getGameData(appID);
                } else {
                    $('.result').text('AppID not found');
                }
            },
            error: function(xhr, status, error) {
                console.error(status + ": " + error);
            }
        });
    });

    function findAppID(inputName, data) {
        var apps = data.applist.apps.app;
        for (var i = 0; i < apps.length; i++) {
            if (apps[i].name.toLowerCase() === inputName.toLowerCase()) {
                return apps[i].appid;
            }
        }
        return null;
    }

    function getGameData(appID) {
        // Request data for Argentina
        $.ajax({
            url: 'https://store.steampowered.com/api/appdetails/?appids=' + appID + '&cc=AR',
            dataType: 'json',
            success: function(dataAR) {
                displayGameData(dataAR, 'Argentina');
            },
            error: function(xhr, status, error) {
                console.error(status + ": " + error);
            }
        });

        // Request data for the US
        $.ajax({
            url: 'https://store.steampowered.com/api/appdetails/?appids=' + appID + '&cc=US',
            dataType: 'json',
            success: function(dataUS) {
                displayGameData(dataUS, 'US');
            },
            error: function(xhr, status, error) {
                console.error(status + ": " + error);
            }
        });
    }

    function displayGameData(data, country) {
        if (data && data[appID] && data[appID].success) {
            var gameData = data[appID].data;
            $('.result').append('<h3>' + country + ' Data</h3>');
            $('.result').append('<p>Name: ' + gameData.name + '</p>');
            $('.result').append('<p>Price: ' + (gameData.price_overview ? gameData.price_overview.final / 100 : 'Not available') + '</p>');
            // Add more details as needed
        } else {
            $('.result').append('<p>No data available for ' + country + '</p>');
        }
    }
});
