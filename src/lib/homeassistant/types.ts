export interface EntityState {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated: string;
  context: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
  attributes: {
    [key: string]: any;
  };
}

export interface CameraState extends EntityState {
  attributes: {
    access_token: string;
    entity_picture: string;
    friendly_name: string;
  };
}
