import io, { Socket } from "socket.io-client";
import { Message, useStore } from "./store";
import { Colors, getRandom } from "../helpers/utils";

type OnConnectionFn = (id: string, player: Player) => void;

export class Player {
  socket: Socket | undefined;
  name: string;
  npc: boolean;
  id: string | undefined;
  color: string;

  constructor(props: {
    name: string;
    npc: boolean;
    onConnection: OnConnectionFn;
  }) {
    this.name = props.name;
    this.npc = props.npc;
    this.color = Colors[Math.round(getRandom(0, 2))];
    this.initSocket(props.onConnection);
  }

  initSocket(onConnection: OnConnectionFn) {
    this.socket = io({
      query: {
        name: this.name,
      },
    });

    this.socket.on("init", (id: string) => {
      onConnection(id, this);
      if (this.npc) {
        this.initPeriodicMessages();
      }

      this.id = id;
    });

    this.socket.on("message", (msg: Message) => {
      useStore.getState().addMessage(msg);
    });
  }

  initPeriodicMessages() {
    setTimeout(
      () => {
        this.sendMessage("Hello ppl!");
      },
      getRandom(2000, 10000),
    );
  }

  sendMessage(msg: string) {
    this.socket?.emit("message", msg);
  }
}
