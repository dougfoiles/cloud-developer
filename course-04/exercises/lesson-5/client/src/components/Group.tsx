import * as React from "react";
import { Card } from "semantic-ui-react";
import { GroupModel } from "../types/GroupModel";
import { Link } from "react-router-dom";

interface GroupCardProps {
  group: GroupModel;
}

interface GroupCardState {}

export class Group extends React.PureComponent<GroupCardProps, GroupCardState> {
  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            <Link to={`/images/${this.props.group.id.S}`}>
              {this.props.group.name.S}
            </Link>
          </Card.Header>
          <Card.Description>{this.props.group.description.S}</Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
