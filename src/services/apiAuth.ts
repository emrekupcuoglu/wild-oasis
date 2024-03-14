import supabase, { supabaseUrl } from "./supabase";

export interface signUpParams {
  fullName: string;
  email: string;
  password: string;
}
export async function signUp({ fullName, email, password }: signUpParams) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullName, avatar: "" } },
  });

  if (error) throw new Error(error.message);

  return data;
}
interface loginParams {
  email: string;
  password: string;
}
export async function login({ email, password }: loginParams) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data.user;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  // ! We can NOT use the user from the getSession method
  // getSession returns the session JWT from the localStorage
  // but this is not trustworthy, check if the session exist first then get the user using the getUser method.

  // ? from supabase docs:
  // getSession: Returns the session, refreshing it if necessary.
  // The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.

  // This method retrieves the current local session (i.e local storage).
  // The session contains a signed JWT and unencoded session data.
  // Since the unencoded session data is retrieved from the local storage medium, do not rely on it as a source of trusted data on the server. It could be tampered with by the sender. If you need verified, trustworthy user data, call getUser instead.
  // If the session has an expired access token, this method will use the refresh token to get a new session.

  // getUser takes in an optional access token jwt, if no jwt is provided it will try to get the jwt from the current session
  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return user?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export interface updateCurrentUserParams {
  userId: string;
  password?: string;
  newPassword?: string;
  fullName?: string;
  avatar?: File | undefined | null;
  email: string;
}

export async function updateCurrentUser({
  userId,
  password,
  newPassword,
  email,
  fullName,
  avatar,
}: updateCurrentUserParams) {
  // 1. Update the password OR fullName

  interface IUpdatePassword {
    updatedField: "password";
    password: string;
  }

  interface IUpdateNameAndAvatar {
    updatedField: "fullName";
    data: {
      fullName: string;
      avatar?: string;
    };
  }

  let updateData: IUpdatePassword | IUpdateNameAndAvatar | null = null;

  // if (password && newPassword && password === newPassword)
  if (password && newPassword && !fullName) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    if (data?.user?.role === "authenticated")
      updateData = { updatedField: "password", password: newPassword };
    else throw new Error("Password is not correct");
  }

  if (fullName && !password && !newPassword)
    updateData = { updatedField: "fullName", data: { fullName } };

  if (!updateData) throw new Error("Full name and/or password is missing ");

  if (!avatar) {
    const { data, error } = await supabase.auth.updateUser(updateData);
    // supabase.auth.

    if (error) throw new Error(error.message);
    return data;
  }

  // 2. Upload the avatar image
  const fileName = `avatar-${userId}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);
  // 3. Get the current avatar image url
  const { data: curData } = await supabase.auth.getUser();
  const curAvatar = curData.user?.user_metadata.avatar as string;
  // 4. Update avatar in the user

  if (updateData.updatedField !== "fullName")
    throw new Error("Something went wrong");

  updateData.data.avatar = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);
  // data.user?.user_metadata.avatar;
  console.log("curavatar", curAvatar);

  const curAvatarPath = curAvatar.split("/").at(-1)!;
  console.log(curAvatarPath);

  const { error: deletionError, data: tdata } = await supabase.storage
    .from("avatars")
    .remove([curAvatarPath]);
  if (deletionError) {
    console.error(deletionError);
    throw new Error(deletionError.message);
  }
  console.log("tdata", tdata);
  return data;
}
