import {
  ListItem,
  ListItemAvatar,
  ListItemProps,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import Avatar from "../../../components/Avatar";
import { GroupChat } from "../../../pb/conversations_pb";
import { firstName } from "../../../utils/names";
import { useAuthContext } from "../../auth/AuthProvider";
import useUsers from "../../userQueries/useUsers";
import {
  controlMessageText,
  groupChatTitleText,
  isControlMessage,
  messageTargetId,
} from "../utils";

const useStyles = makeStyles({ root: {} });

export interface GroupChatListItemProps extends ListItemProps {
  groupChat: GroupChat.AsObject;
}

export default function GroupChatListItem({
  groupChat,
}: GroupChatListItemProps) {
  const classes = useStyles();
  const currentUserId = useAuthContext().authState.userId!;
  const latestMessageAuthorId = groupChat.latestMessage?.authorUserId;

  const groupChatMembersQuery = useUsers(groupChat.memberUserIdsList);

  //the avatar is of the latest message author (if it's not the logged in user),
  //otherwise any user that's not the logged in user, otherwise logged in user
  const avatarUserId =
    latestMessageAuthorId !== null && latestMessageAuthorId !== currentUserId
      ? latestMessageAuthorId
      : groupChat.memberUserIdsList.find((id) => id !== currentUserId) ??
        currentUserId;
  //title is the chat title, or all the member's names except current user joined together
  const title = groupChatTitleText(
    groupChat,
    groupChatMembersQuery,
    currentUserId
  );
  //text is the control message text or message text, truncated
  const text = groupChat.latestMessage
    ? isControlMessage(groupChat.latestMessage)
      ? controlMessageText(
          groupChat.latestMessage,
          firstName(
            groupChatMembersQuery.data?.get(
              groupChat.latestMessage.authorUserId
            )?.name
          ) || "",
          firstName(
            groupChatMembersQuery.data?.get(
              messageTargetId(groupChat.latestMessage)
            )?.name
          ) || ""
        )
      : //if it's a normal message, show "<User's Name>: <The message>"
        `${firstName(
          groupChatMembersQuery.data?.get(groupChat.latestMessage.authorUserId)
            ?.name
        )}: ${groupChat.latestMessage.text?.text || ""}`
    : "";

  return (
    <ListItem button className={classes.root}>
      <ListItemAvatar>
        {groupChatMembersQuery.isLoading ? (
          <Skeleton />
        ) : (
          <Avatar user={groupChatMembersQuery.data?.get(avatarUserId)} />
        )}
      </ListItemAvatar>
      {
        //When we want more than primary and secondary (host Request status, etc)
        //They can also take react nodes. But change typography component using props
      }
      <ListItemText
        primary={groupChatMembersQuery.isLoading ? <Skeleton /> : title}
        secondary={groupChatMembersQuery.isLoading ? <Skeleton /> : text}
        primaryTypographyProps={{ noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
      />
    </ListItem>
  );
}
