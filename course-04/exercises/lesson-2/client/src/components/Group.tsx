import * as React from "react";
import { Card } from "semantic-ui-react";
import { GroupModel } from "../types/GroupModel";

interface GroupCardProps {
  group: GroupModel;
}

interface GroupCardState {}

export class Group extends React.PureComponent<GroupCardProps, GroupCardState> {
  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>{this.props.group.name.S}</Card.Header>
          <Card.Description>{this.props.group.description.S}</Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
