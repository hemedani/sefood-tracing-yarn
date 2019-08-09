import axios from "axios";

interface InputSMS {
  phone?: string | number;
  code?: number;
  msg?: string;
  phones?: [string | number];
}

type SendCustomMsgResp = [number, string];
type SendPatternResponse = number;

export const sendPattern = ({ phone, code }: InputSMS): Promise<SendPatternResponse> => {
  return axios
    .post(`http://37.130.202.188/api/select`, {
      op: "patternV2",
      user: "09184424686",
      pass: "9184424686",
      fromNum: "+98100020400",
      toNum: `+${phone}`,
      patternCode: "1213",
      inputData: {
        code: code
      }
    })
    .then(resp => resp.data);
};

export const sendCustomMsg = ({ phones, msg }: InputSMS): Promise<SendCustomMsgResp> => {
  return axios
    .post(`http://37.130.202.188/api/select`, {
      op: "send",
      uname: "09184424686",
      pass: "9184424686",
      message: msg,
      from: "+98100020400",
      to: phones
    })
    .then(resp => resp.data)
    .catch(err => err.response);
};
