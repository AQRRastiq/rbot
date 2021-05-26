const discord = require("discord.js");
const ms = require('ms');

module.exports = {
  name: "gnew",
  category: "giveaways",
  description: "Créer un giveaway",
  usage: "gnew <#salon> <durée> <nombre de gagnants> <prix>",
  run: async (client, message, args) => {
    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':x: Vous ne passerez pas ! (Vous n\'avez pas la permission d\'utiliser cette commande)');
    }

    // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if(!giveawayChannel){
        return message.channel.send(':x: Vous devez mentionner un salon valide !');
    }

    // Giveaway duration
    let giveawayDuration = args[1];
    // If the duration isn't valid
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: Vous devez mentionner une durée valide !');
    }

    // Number of winners
    let giveawayNumberWinners = args[2];
    // If the specified number of winners is not a number
    if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
        return message.channel.send(':x: Vous devez mentionner un nombre de gagnants valide !');
    }

    // Giveaway prize
    let giveawayPrize = args.slice(3).join(' ');
    // If no prize is specified
    if(!giveawayPrize){
        return message.channel.send(':x: Vous devez spécifier un prix valide !');
    }

    // Start the giveaway
    client.giveawaysManager.start(giveawayChannel, {
        // The giveaway duration
        time: ms(giveawayDuration),
        // The giveaway prize
        prize: giveawayPrize,
        // The giveaway winner count
        winnerCount: parseInt(giveawayNumberWinners),
        // Who hosts this giveaway
        hostedBy: client.config.hostedBy ? message.author : null,
        // Messages
        messages: {
            giveaway: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: (client.config.everyoneMention ? "@everyone\n\n" : "")+"🎉🎉 **GIVEAWAY TERMINÉ** 🎉🎉",
            timeRemaining: "Temps restant: **{duration}**!",
            inviteToParticipate: "Réagissez avec 🎉 pour participer !",
            winMessage: "Bravo, {winners} ! Vous avez gagné **{prize}** !",
            embedFooter: "RastiqGiveaways",
            noWinner: "Giveaway annulé, pas assez de participations.",
            hostedBy: "Créé par {user}",
            winners: "gagnant(s)",
            endedAt: "Terminé à",
            units: {
                seconds: "secondes",
                minutes: "minutes",
                hours: "heures",
                days: "jours",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });

    message.channel.send(`Giveaway lancé dans ${args[0]}!`);
    let embed = new discord.MessageEmbed()
        .setAuthor(message.member.user.username, message.member.user.displayAvatarURL({dynamic: true}))
        .setDescription(`${message.member} a lancé un giveaway avec le prix "${giveawayPrize}" !`)
        .addField("__Salon du giveaway :__", giveawayChannel, true)
        .setColor("#4EF20C")
  
                // On lance le compte à rebours
    setTimeout(function() {
            client.channels.cache.get('835780445475307544').send({embed: embed }) // Envoie de l'embed final dans le channel de LOG
    }, 5000)

    
  }
}