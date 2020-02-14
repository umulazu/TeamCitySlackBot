export default async (webClient, channelName) => {
    try {
        const result = await webClient.conversations.list();
        if (!result && !result.ok) {
            return null;
        }

        const listOfChannels = result.channels;

        const channel = listOfChannels.find(
            channel => channel.name === channelName
        );

        return channel && channel.id;
    } catch (error) {
        console.error(error);
    }
};