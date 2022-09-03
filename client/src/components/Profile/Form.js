<UserProfileForm 
onSubmit={updateUserProfile}>
<Label htmlFor='home'>Home</Label>
<Input
    autoFocus
    type="text"
    placeholder="Home"
    value={homeInput}
    required={true}
    onChange={(e) => {setHomeInput(e.target.value)}}
/>
<Label htmlFor='work'>Work</Label>
<Input
    type="text"
    placeholder="Work"
    // value={"275 Notre-Dame St. East, Montreal, Quebec H2Y 1C"}
    value={workInput}
    required={true}
    onChange={(e) => {setWorkInput(e.target.value)}}
/>
<UserProfileSubmit type="submit"> Submit </UserProfileSubmit>
</UserProfileForm>