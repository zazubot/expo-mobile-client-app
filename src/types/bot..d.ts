interface Bot {
  name: "<string>";
  icon: "<string>";
  id: "<string>";
  accessRight: "read";
  publishedTypebotId: "<string>";
}

interface BotListResponse {
  typebots: Bot[];
}
