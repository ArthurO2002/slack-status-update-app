type IData = Record<string, string>
interface IFinalData {
  username:string,
  date: Date,
  todayWork: string,
  yesterdayWork: string
}
interface IStateValues {
  [key:string]: {
    [key:string]: {
      value: string,
      selected_date: string
    }
  }
}
interface IState {
  values: IStateValues
}
interface IUser {
  username: string,
  name: string,
  id: string,
  team_id: string
}
interface IContainer {
  channel_id: string
  is_ephemeral: boolean
  message_ts: string
  type: string
}
interface IActions {
  action_id: string,
  action_ts: string,
  type: string
}
interface IBody {
  state: IState,
  response_url: string,
  user: IUser,
  container: IContainer,
  token: string
  actions: IActions[]
}

export {
  IData,
  IFinalData,
  IBody,
  IState,
  IStateValues,
};
