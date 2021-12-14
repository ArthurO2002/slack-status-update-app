import {IBody, IData, IFinalData, IStateValues} from "../models";

class Service {
  private getUserInsertedData(values: IStateValues) {
    const keys = Object.keys(values);
    const data:IData = {};
    keys.forEach((el:string) => {
      const fieldName = Object.keys(values[el])[0];
      if (values[el][fieldName].value) {
        data[fieldName] = values[el][fieldName].value;
      } else {
        data[fieldName] = values[el][fieldName].selected_date;
      }
    });
    return data;
  }
  public getStatusUpdate(body: IBody) {
    const data = this.getUserInsertedData(body.state.values);
    data.username = body.user.name;
    const finalData: IFinalData = {
      username: data.username,
      date: new Date(data.date),
      todayWork: data.todayWork,
      yesterdayWork: data.yesterdayWork,
    };
    return finalData;
  }
}
export const service = new Service();
