export interface LeaveFamilyParams {
  userId: string;
}

export interface LeaveFamily {
  execute(request: LeaveFamilyParams): Promise<void>;
}
