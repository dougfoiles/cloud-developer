import * as React from "react";
import { Card, Image } from "semantic-ui-react";
import { ImageModel } from "../types/ImageModel";

interface ImageCardProps {
  image: ImageModel;
}

interface ImageCardState {}

export class UdagramImage extends React.PureComponent<
  ImageCardProps,
  ImageCardState
> {
  render() {
    return (
      <Card fluid color="red">
        <Card.Content>
          <Card.Header>{this.props.image.title.S}</Card.Header>
          <Card.Description>{this.props.image.timestamp.S}</Card.Description>
          {this.props.image.imageUrl.S && (
            <Image src={this.props.image.imageUrl.S} />
          )}
        </Card.Content>
      </Card>
    );
  }
}
