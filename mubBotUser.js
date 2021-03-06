var mubBot = {};
mubBot.misc = {};
mubBot.settings = {};
mubBot.moderators = {};
mubBot.filters = {};
mubBot.pubVars = {};
mubBot.offenses = [];

botMethods = {};

toSave = {};
toSave.settings = mubBot.settings;
toSave.moderators = mubBot.moderators;

mubBot.misc.version = "1.8";
mubBot.misc.origin = "This bot was created by Emub and DerpTheBass alone, and it is copyrighted!";
mubBot.misc.changelog = "Added chat offenses, commands and loads of cool stuff <Emub>";
mubBot.misc.ready = true;
mubBot.misc.lockSkipping = false;
mubBot.misc.lockSkipped = "0";
mubBot.misc.tacos = new Array();

joined = new Date().getTime();

mubBot.filters.swearWords = new Array();
mubBot.filters.racistWords = new Array();
mubBot.filters.beggerWords = new Array();

mubBot.moderators.creators = new Array();
mubBot.moderators.admins = new Array();
mubBot.moderators.trusted = new Array();
mubBot.moderators.tempTrust = new Array();

mubBot.settings.maxLength = 10; //minutes
mubBot.settings.cooldown = 10; //seconds
mubBot.settings.offensesLast = 5; //minutes
mubBot.settings.staffMeansAccess = true;
mubBot.settings.historyFilter = true;
mubBot.settings.swearFilter = true;
mubBot.settings.racismFilter = true;
mubBot.settings.beggerFilter = true;
mubBot.settings.interactive = true;
mubBot.settings.chatOffenses = true;

mubBot.moderators.creators[0] = "50aeaf683e083e18fa2d187e"; // Emub
mubBot.moderators.creators[1] = "50aeb07e96fba52c3ca04ca8"; // DerpTheBass

mubBot.moderators.admins[2] = "50aeb607c3b97a2cb4c35ac1"; // [#808]
mubBot.moderators.admins[3] = "51264d96d6e4a966883b0702"; // eBot

mubBot.filters.swearWords[0] = "fuck";
mubBot.filters.swearWords[1] = "shit";
mubBot.filters.swearWords[2] = "bitch";
mubBot.filters.swearWords[3] = "cunt";
mubBot.filters.swearWords[4] = "twat";
mubBot.filters.swearWords[5] = "fag";
mubBot.filters.swearWords[6] = "queer";

mubBot.filters.racistWords[0] = "nigger";
mubBot.filters.racistWords[1] = "kike";
mubBot.filters.racistWords[2] = "spick";
mubBot.filters.racistWords[3] = "porchmonkey";
mubBot.filters.racistWords[4] = "camel jockey";
mubBot.filters.racistWords[5] = "towelhead";
mubBot.filters.racistWords[6] = "towel head";
mubBot.filters.racistWords[7] = "chink";
mubBot.filters.racistWords[8] = "gook";
mubBot.filters.racistWords[9] = "porch monkey";

mubBot.filters.beggerWords[0] = "fan4fan";
mubBot.filters.beggerWords[1] = "fan me";
mubBot.filters.beggerWords[2] = "fan pls";
mubBot.filters.beggerWords[3] = "fan please";
mubBot.filters.beggerWords[4] = "fan 4 fan";
mubBot.filters.beggerWords[5] = "fan back";
mubBot.filters.beggerWords[6] = "give me fans";
mubBot.filters.beggerWords[7] = "gimme fans";

mubBot.misc.tacos[0] = "crispy taco";
mubBot.misc.tacos[1] = "mexican taco";
mubBot.misc.tacos[2] = "vegetarian taco";
mubBot.misc.tacos[3] = "spicy taco";
mubBot.misc.tacos[4] = "meatlover taco";
mubBot.misc.tacos[5] = "cheese taco";
mubBot.misc.tacos[6] = "wet hamburger";
mubBot.misc.tacos[7] = "taco shell";
mubBot.misc.tacos[8] = "delicious taco";
mubBot.misc.tacos[9] = "gross taco";

mubBot.pubVars.skipOnExceed;
mubBot.pubVars.command = false;

API.on(API.CHAT, chatEvent);
API.on(API.HISTORY_UPDATE, historyUpdateEvent);

function chatEvent(data){
	botMethods.chatEvent(data);
}

function historyUpdateEvent(data){
	setTimeout(function(){ botMethods.historyUpdateEvent(data); }, 500);
}

botMethods.load = function(){
	toSave = JSON.parse(localStorage.getItem("mubBotSave"));
	mubBot.moderators = toSave.moderators;
	mubBot.settings = toSave.settings;
	mubBot.moderators.tempTrust = [];
};

botMethods.save = function(){localStorage.setItem("mubBotSave", JSON.stringify(toSave))};

botMethods.loadStorage = function(){
    if(localStorage.getItem("mubBotSave") !== null){
        botMethods.load();
    }else{
        botMethods.save();
    }
};

botMethods.checkHistory = function(){
    currentlyPlaying = API.getMedia(); history = API.getHistory();
    caught = -1;
    for(var i = 0; i < history.length; i++){
        if(currentlyPlaying.cid === history[i].media.cid){
            caught++;
        }
    }
	
    return caught;
}

botMethods.woot = function(){
    $("#button-vote-positive").click();
}

botMethods.getPermissions = function(id){
	for(var i = 0; i < mubBot.moderators.creators.length; i++){
        if(mubBot.moderators.creators[i] === id) return 4;
    }

    for(var i = 0; i < mubBot.moderators.admins.length; i++){
        if(mubBot.moderators.admins[i] === id) return 3;
    }

    for(var i = 0; i < mubBot.moderators.trusted.length; i++){
        if(mubBot.moderators.trusted[i] === id) return 2;
    }

    for(var i = 0; i < mubBot.moderators.tempTrust.length; i++){
        if(mubBot.moderators.tempTrust[i] === id) return 1;
    }
  
	if(API.getUser(id).permission > 1 && API.getUser(id).permission < 4 && mubBot.settings.staffMeansAccess) return 2;
	if(API.getUser(id).permission > 3 && mubBot.settings.staffMeansAccess) return 3;

	return 0;
}

botMethods.getID = function(username){
	var users = API.getUsers();
	var result = "";
	for(var i = 0; i < users.length; i++){
		if(users[i].username === username){
			result = users[i].id;
			return result;
		}
	}

	return "notFound";
}

botMethods.removeOffense = function(type, id){
	setTimeout(function(){
		var found = false; var foundAs = 0;
		for(var i = 0; i < mubBot.offenses.length; i++){
			if(mubBot.offenses[i].ID = id){
				found = true;
				foundAs = i;
			}
		}
		
		if(found){
			switch(type){
				case "swear":
					mubBot.offenses[foundAs].swearOffenses--;
				break;
				case "racism":
					mubBot.offenses[foundAs].racismOffenses--;
				break;
				case "begging":
					mubBot.offenses[foundAs].beggingOffenses--;
				break;
			}
		}
	}, mubBot.settings.offensesLast * 60000);
}

botMethods.addOffense = function(type, id){
	if(id !== null){
		newOffender = {};
		newOffender.ID = id;
		newOffender.swearOffenses = 0;
		newOffender.racismOffenses = 0;
		newOffender.beggingOffenses = 0;
		
		var isOffender = false; var offenderCount = 0;
		for(var i = 0; i < mubBot.offenses.length; i++){
			if(mubBot.offenses[i].ID = id){
				isOffender = true;
				offenderCount = i;
			}
		}
		
		switch(type){
			case "swear":
				if(isOffender){
					mubBot.offenses[offenderCount].swearOffenses++;
				}else{
					newOffender.swearOffenses = 1;
					mubBot.offenses.push(newOffender);
				}
			break;
			case "racism":
				if(isOffender){
					mubBot.offenses[offenderCount].racismOffenses++;
				}else{
					newOffender.racismOffenses = 1;
					mubBot.offenses.push(newOffender);
				}
			break;
			case "begging":
				if(isOffender){
					mubBot.offenses[offenderCount].beggingOffenses++;
				}else{
					newOffender.beggingOffenses = 1;
					mubBot.offenses.push(newOffender);
				}
			break;
		}
		
		botMethods.removeOffense(type, mubBot.offenses[offenderCount].ID);
	}
}

botMethods.getOffenses = function(type, id){
	switch(type){
		case "swear":
			for(var i = 0; i < mubBot.offenses.length; i++){
				if(mubBot.offenses[i].ID = id){
					return mubBot.offenses[i].swearOffenses;
				}
			}
		break;
		case "racism":
			for(var i = 0; i < mubBot.offenses.length; i++){
				if(mubBot.offenses[i].ID = id){
					return mubBot.offenses[i].racismOffenses;
				}
			}
		break;
		case "begging":
			for(var i = 0; i < mubBot.offenses.length; i++){
				if(mubBot.offenses[i].ID = id){
					return mubBot.offenses[i].beggingOffenses;
				}
			}
		break;
		case "all":
			for(var i = 0; i < mubBot.offenses.length; i++){
				if(mubBot.offenses[i].ID = id){
					var offenses = mubBot.offenses[i].beggingOffenses + mubBot.offenses[i].racismOffenses + mubBot.offenses[i].swearOffenses;
					return offenses;
				}
			}
		break;
	}
	
	return 0;
}


botMethods.historyUpdateEvent = function(data){
    clearTimeout(mubBot.pubVars.skipOnExceed);
	if(mubBot.misc.lockSkipping){
		API.moderateAddDJ(mubBot.misc.lockSkipped);
		mubBot.misc.lockSkipped = "0";
		mubBot.misc.lockSkipping = false;
		setTimeout(function(){ API.moderateRoomProps(false, true); }, 500);
	}
    var song = API.getMedia();
    if(botMethods.checkHistory() > 0 && mubBot.settings.historyFilter){
        if(API.getUser().permission < 2){
            API.sendChat("This song is in the history! You should make me a mod so that I could skip it!");
        }else{
			API.sendChat("@" + API.getDJs()[0].username + ", playing songs that are in the history isn't allowed, please check next time! Skipping..");
			setTimeout(function(){API.moderateForceSkip()}, 1500)
		}
    }else if(song.duration > mubBot.settings.maxLength * 60){
		mubBot.pubVars.skipOnExceed = setTimeout( function(){
			API.sendChat("@"+API.getDJs()[0].username+" You have now played for as long as this room allows, time to let someone else have the booth!");
		        API.moderateForceSkip();
		}, mubBot.settings.maxLength * 60000);
		//API.sendChat("@"+API.getDJs()[0].username+" This song will be skipped " + mubBot.settings.maxLength + " minutes from now because it exceeds the max song length.");
	}
}

botMethods.chatEvent = function(data){
	command = false; var chatCommand = "";
	var permission = botMethods.getPermissions(data.fromID);
	if(data.message.indexOf("!") === 0) command = true;
	if(command){

		chatCommand = data.message.substring(1);
		var commands = chatCommand.split(" ");
		commands.push("undefined");
		
		for(var i = 2; i < commands.length; i++){
			if(commands[i] !== "undefined") commands[1] = commands[1] + " " + commands[i];
		}

		if(mubBot.misc.ready || permission > 2){
			switch(commands[0].toLowerCase()){
				case "meh":
					if(permission > 0) $("#button-vote-negative").click();
				break;

				case "woot":
					if(permission > 0) $("#button-vote-positive").click();
				break;

				case "skipthis":
					permission > 2 ? API.moderateForceSkip() : API.sendChat("This commands requires being a mod admin!");
				break;

				case "temp":
					if(permission > 2){
						if(commands[1] === "undefined"){
							API.sendChat("@" + data.from + ", you must put a username.");
						}else{
							if(commands[1].indexOf("@") === 0) commands[1] = commands[1].substring(1);
							var ID = botMethods.getID(commands[1]);
							if(ID !== "notFound"){
								mubBot.moderators.tempTrust.push(ID);
								API.sendChat("Congratulations on earning temporary trust, @" + API.getUser(ID).username + "!");
							}else{
								API.sendChat("This user could not be found in the room.");
							}
						}
					}else{
						API.sendChat("Only admins can grant access to others.");
					}
				break;

				case "trust":
					if(permission > 3){
						if(commands[1] === "undefined"){
							API.sendChat("@" + data.from + ", you must put a username.");
						}else{
							if(commands[1].indexOf("@") === 0) commands[1] = commands[1].substring(1);
							var ID = botMethods.getID(commands[1]);
							if(ID !== "notFound"){
								mubBot.moderators.trusted.push(ID);
								API.sendChat("Congratulations on earning trust, @" + API.getUser(ID).username + "!!!");
							}else{
								API.sendChat("This user could not be found in the room.");
							}
						}
					}else{
						API.sendChat("Only bot creators can grant access to others.");
					}
					botMethods.save();
				break;

				case "access":
					if(commands[1] !== "undefined"){
						if(commands[1].indexOf("@") === 0) commands[1] = commands[1].substring(1);
						if(permission > 0){

							var userPermission = botMethods.getPermissions(botMethods.getID(commands[1]));
							userPermission === 0 ? API.sendChat("This user has no bot permissions") : API.sendChat("This user has level " + userPermission + " access");

						}else{
							API.sendChat("You must be at least a trusted bot user to check others access levels!");
						}
					}else{
						API.sendChat("@" + data.from + ", you have level " + permission + " access");
					}
				break;

				case "historyfilter":
				case "hf":
					if(permission > 0) mubBot.settings.historyFilter ? API.sendChat("History filter is enabled.") : API.sendChat("History filter is disabled.");
				break;

				case "swearfilter":
				case "sf":
					if(permission > 0) mubBot.settings.swearFilter ? API.sendChat("Swearing filter is enabled.") : API.sendChat("Swearing filter is disabled.");
				break;

				case "racismfilter":
				case "rf":
					if(permission > 0) mubBot.settings.racismFilter ? API.sendChat("Racism filter is enabled.") : API.sendChat("Racism filter is disabled.");
				break;

				case "beggerfilter":
				case "bf":
					if(permission > 0) mubBot.settings.beggerFilter ? API.sendChat("Begger filter is enabled.") : API.sendChat("Begger filter is disabled.");
				break;
				
				case "offenses":
					if(permission > 0) mubBot.settings.chatOffenses ? API.sendChat("Chat offenses are being stored.") : API.sendChat("Chat offenses won't be remembered.");
				break;
				
				case "to":
					if(permission > 2){
						if(mubBot.settings.chatOffenses){
							mubBot.settings.chatOffenses = false;
							API.sendChat("Bot will no longer remember offenses.");
						}else{
							mubBot.settings.chatOffenses = true;
							API.sendChat("Bot will now remember offenses.");
						}
					}
				break;

				case "tsf":
					if(permission > 2){
						if(mubBot.settings.swearFilter){
							mubBot.settings.swearFilter = false;
							API.sendChat("Bot will no longer filter swearing.");
						}else{
							mubBot.settings.swearFilter = true;
							API.sendChat("Bot will now filter swearing.");
						}
					}
				break;

				case "trf":
					if(permission > 2){
						if(mubBot.settings.racismFilter){
							mubBot.settings.racismFilter = false;
							API.sendChat("Bot will no longer filter racism.");
						}else{
							mubBot.settings.racismFilter = true;
							API.sendChat("Bot will now filter racism.");
						}
					}
				break;

				case "tbf":
					if(permission > 2){
						if(mubBot.settings.beggerFilter){
							mubBot.settings.beggerFilter = false;
							API.sendChat("Bot will no longer filter fan begging.");
						}else{
							mubBot.settings.beggerFilter = true;
							API.sendChat("Bot will now filter fan begging.");
						}
					}
				break;

				case "thf":
					if(permission > 2){
						if(mubBot.settings.historyFilter){
							mubBot.settings.historyFilter = false;
							API.sendChat("Bot will no longer skip songs that are in the room history.");
						}else{
							mubBot.settings.historyFilter = true;
							API.sendChat("Bot will now skip songs that are in the room history.");
						}
					}
				break;

				case "version":
					API.sendChat("mubBot user shell version " + mubBot.misc.version);
				break;

				case "marco":
					API.sendChat("Polo");
				break;

				case "origin":
				case "author":
				case "authors":
				case "creator":
					API.sendChat(mubBot.misc.origin);
				break;

				case "status":
					if(permission > 0);
					var response = "";
					var currentTime = new Date().getTime();
					var minutes = Math.round((currentTime - joined) / 60000);
					var hours = 0;
					while(minutes > 59){
						minutes = minutes - 60;
						hours++;
					}
					hours === 0 ? response = "Running for " + minutes + " minutes - " : response = "Running for " + hours + "h and " + minutes + "m - ";
					mubBot.settings.beggerFilter ? response = response + "Begger filter is enabled! - " : response = response + "Begger filter is disabled! - ";
					mubBot.settings.swearFilter ? response = response + "Swear filter is enabled! - " : response = response + "Swear filter is disabled! - ";
					mubBot.settings.racismFilter ? response = response + "Racism filter is enabled! - " : response = response + "Racism filter is disabled! - ";
					mubBot.settings.historyFilter ? response = response + "History filter is enabled! - " : response = response + "History filter is disabled! - ";
					response = response + "MaxLength is " + mubBot.settings.maxLength + " minutes - ";
					response = response + "Cooldown is " + mubBot.settings.cooldown + " seconds - ";
					response = response + "Mod access is " + mubBot.settings.staffMeansAccess;
					API.sendChat(response);
				break;

				case "maxlength":
					if(permission > 2){
						if(commands[1] === "undefined"){ 
							API.sendChat("Current max song length is " + mubBot.settings.maxLength + " minutes.");
						}
						if(commands[1] === "disable"){
							mubBot.settings.maxLength = 9999999999;
							API.sendChat("Max length is now (almost) infinite");
						}else if(commands[1] !== "undefined"){
							mubBot.settings.maxLength = commands[1];
							API.sendChat("New max song length is " + mubBot.settings.maxLength + " minutes.");
						}
					}
				break;

				case "cooldown":
					if(permission > 2){
						if(commands[1] === "undefined"){
							API.sendChat("Current command cooldown is " + mubBot.settings.cooldown + " seconds.");
						}
						if(commands[1] === "disable"){
							mubBot.settings.cooldown = 0.001;
							API.sendChat("Command cooldown disabled");
						}else if(commands[1] !== "undefined"){
							mubBot.settings.cooldown = commands[1];
							API.sendChat("New command cooldown is " + mubBot.settings.cooldown + " seconds.");
						}
					}
				break;

				case "taco":
					if(commands[1] === "undefined"){
						var crowd = API.getUsers();
						var randomUser = Math.round(Math.random() * crowd.length);
						var randomTaco = Math.round(Math.random() * mubBot.misc.tacos.length);
						var randomSentence = Math.round(Math.random() * 4);
						switch(randomSentence){
							case 1:
								API.sendChat("@" + crowd[randomUser].username + ", take this " + mubBot.misc.tacos[randomTaco] + ", you bitch!");
							break;
							case 2:
								API.sendChat("@" + crowd[randomUser].username + ", quickly! Eat this " + mubBot.misc.tacos[randomTaco] + " before I do!");
							break;
							case 3:
								API.sendChat("One free " + mubBot.misc.tacos[randomTaco] + " for you, @" + crowd[randomUser].username + ". :3");
							break;
							case 4:
								API.sendChat("/me throws a " + mubBot.misc.tacos[randomTaco] + " at @" + crowd[randomUser].username + "!");
							break;
						}
					}else{
						if(commands[1].indexOf("@") === 0) commands[1] = commands[1].substring(1);
						var randomTaco = Math.round(Math.random() * mubBot.misc.tacos.length);
						var randomSentence = Math.round(Math.random() * 4);
						switch(randomSentence){
							case 1:
								API.sendChat("@" + commands[1] + ", take this " + mubBot.misc.tacos[randomTaco] + ", you bitch!");
							break;
							case 2:
								API.sendChat("@" + commands[1] + ", quickly! Eat this " + mubBot.misc.tacos[randomTaco] + " before I do!");
							break;
							case 3:
								API.sendChat("One free " + mubBot.misc.tacos[randomTaco] + " for you, @" + commands[1] + ". :3");
							break;
							case 4:
								API.sendChat("/me throws a " + mubBot.misc.tacos[randomTaco] + " at @" + commands[1] + "!");
							break;
						}
					}
				break;

				case "modaccess":
					if(permission > 0){
						mubBot.settings.staffMeansAccess ? API.sendChat("Staff currently has bot access.") : API.sendChat("Staff doesn't have bot access.");
					}
				break;

				case "togglemodaccess":
				case "tma":
					if(permission > 2){
						if(mubBot.settings.staffMeansAccess){
							mubBot.settings.staffMeansAccess = false;
							API.sendChat("Staff no longer have bot access.");
						}else{
							mubBot.settings.staffMeansAccess = true;
							API.sendChat("Staff now has bot access.");
						}
					}
				break;

				case "interactive":
					if(permission > 0){
						mubBot.settings.interactive ? API.sendChat("Bot is interactive.") : API.sendChat("Bot is not interactive.");
					}
				break;

				case "toggleinteractive":
				case "ti":
					if(permission > 0){
						if(mubBot.settings.interactive){
							mubBot.settings.interactive = false;
							API.sendChat("Bot will no longer interact.");
						}else{
							mubBot.settings.interactive = true;
							API.sendChat("Bot will now interact.");
						}
					}
				break;

				case "save":
					if(permission > 2){
						botMethods.save();
						API.sendChat("Settings saved.");
					}
				break;

				case "stfu":
					if(permission > 0){
						mubBot.settings.interactive = false;
						API.sendChat("Yessir!");
					}
				break;

				case "changelog":
					if(permission > 0){
						API.sendChat("New in version " + mubBot.misc.version + " - " + mubBot.misc.changelog)
					}
				break;
				
				case "lockskip":
					if(permission > 1){
						API.moderateRoomProps(true, true);
						mubBot.misc.lockSkipping = true;
						mubBot.misc.lockSkipped = API.getDJs()[0].id;
						setTimeout(function(){ API.moderateRemoveDJ(mubBot.misc.lockSkipped); }, 500);
					}else{
						API.sendChat("This command requires level 2 bot access!");
					}
				break;
				
				case "offenseslast":
				case "ol":
					if(permission > 0){
						if(commands[1] === "undefined"){
							API.sendChat("Offenses currently last " + mubBot.settings.offensesLast + " minutes.");
						}else{
							mubBot.settings.offensesLast = commands[1];
							API.sendChat("Offenses now last for " + mubBot.settings.offensesLast + " minutes.");
						}
					}
				break;
			}
		}
		mubBot.misc.ready = false;
		setTimeout(function(){ mubBot.misc.ready = true; }, mubBot.settings.cooldown * 1000);
	}else{

		// swearing
		for(var s = 0; s < mubBot.filters.swearWords.length; s++){
			if(data.message.toLowerCase().indexOf(mubBot.filters.swearWords[s]) > -1 && mubBot.settings.swearFilter){
				API.moderateDeleteChat(data.chatID);
				botMethods.addOffense("swear", data.fromID);
				if(botMethods.getOffenses("swear", data.fromID) === 3 && mubBot.settings.chatOffenses) API.sendChat("@" + data.from + ", whoa! You should really quit saying such nasty words, they are not allowed in this room!");
			}
		}

		// racism
		for(var a = 0; a < mubBot.filters.racistWords.length; a++){
			if(data.message.toLowerCase().indexOf(mubBot.filters.racistWords[a]) > -1 && mubBot.settings.racismFilter){
				API.moderateDeleteChat(data.chatID);
				botMethods.addOffense("racism", data.fromID);
				if(botMethods.getOffenses("racism", data.fromID) === 3 && mubBot.settings.chatOffenses) API.sendChat("@" + data.from + ", listen up, buddy! We don't appreciate racism here!");
			}
		}

		// begging
		for(var a = 0; a < mubBot.filters.beggerWords.length; a++){
			if(data.message.toLowerCase().indexOf(mubBot.filters.beggerWords[a]) > -1 && mubBot.settings.beggerFilter){
				API.moderateDeleteChat(data.chatID);
				botMethods.addOffense("begging", data.fromID);
				if(botMethods.getOffenses("begging", data.fromID) === 2 && mubBot.settings.chatOffenses) API.sendChat("@" + data.from + ", we do not allow asking for fans in this room!");
			}
		}

		if(mubBot.misc.ready && mubBot.settings.interactive){
			if(data.message.toLowerCase().indexOf("who made this bot") > -1) API.sendChat(mubBot.misc.origin);
			if(data.message.toLowerCase().indexOf("stupid bot") > -1) API.sendChat("Thanks, it means a lot coming from a dyslexic kid who fails to spell their name.");
			if(data.message.toLowerCase().indexOf("hello") === 0 || data.message.toLowerCase().indexOf("hi") === 0 || data.message.toLowerCase().indexOf("hey") === 0) API.sendChat("Why hello, @" + data.from);
			if(data.message.toLowerCase().indexOf("sorry") > -1) API.sendChat("It's alright, @" + data.from + ", I forgive you!");
		}

	}
}

botMethods.loadStorage();
console.log("Running mubBot User Shell version " + mubBot.misc.version);
