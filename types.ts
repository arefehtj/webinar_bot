export interface User {
  id: string;
  name: string;
  phone: string;
  source: string;
  referrals: number;
  giftsReceived: number;
}

export interface AdminSettings {
  giftFile: string;
  referralBannerImage: string;
  referralBannerText: string;
  isSmsActive: boolean;
  smsText: string;
}
