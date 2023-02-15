interface LoginWithPostHog {
  sessionToken: string;
  identifyOnPostHog: true;
  profileId: string;
  name?: string;
}

interface LoginWithoutPostHog {
  sessionToken: string;
  identifyOnPostHog?: false;
  profileId?: undefined;
  name?: undefined;
}

export type LoginArgs = LoginWithPostHog | LoginWithoutPostHog;
