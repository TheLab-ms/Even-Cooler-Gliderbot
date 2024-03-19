import { CommandInteraction, CacheType, EmbedBuilder } from "discord.js";
import { Command } from "../../interfaces/Commands";
import EventData from "../../interfaces/EventData.interface";
import HomeAssistant from "../../lib/homeassistant";

export class Keyfob extends Command {
    title = "keyfob";
    description = "Get the last scanned keyfob value";
    isEphemeral = true;

    async run(interaction: CommandInteraction<CacheType>, data: EventData): Promise<void> {
        const homeAssistant = new HomeAssistant();
        try {
            const { state, last_changed } = (await homeAssistant.getEntity("cardreader.value"));
            const date = new Date(last_changed);
            const embed = new EmbedBuilder()
                .setTitle("Keyfob")
                .setFields([{
                    name: "Keyfob ID",
                    value: state
                }])
                .setFooter({
                    text: `Last Updated: ${date.getMonth() + 1}/${date.getDate()} @ ${date.getHours() % 12 || 12}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`
                })
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            interaction.editReply("It seems no keyfob has been scanned recently. Try scanning it again");
        }
    }
}
