export default async (webClient, topicArguments) => {
    const {
        channel,
        build_name,
        build_event,
        build_result,
        icon,
    } = topicArguments;

    try {
        const result = await webClient.conversations.setTopic({
            channel,
            topic: `${icon} ${build_name} on ${build_event}: ${build_result}`,
        });

        return result && result.ok;
    } catch (error) {
        console.error(error);
    }
};