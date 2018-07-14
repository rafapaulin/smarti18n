
export class ObjMap<T> {
	[prop: string]: ObjMap<T> | T;
}
