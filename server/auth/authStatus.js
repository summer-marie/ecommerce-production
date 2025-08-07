const authStatus = (req, res, next) => {
  console.log('AUTH STATUS CHECK');
  console.log('req.user', req.user);

  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authenticated',
      user: null 
    });
  } else {
    return res.status(200).json({ 
      success: true,
      message: 'Authenticated successfully',
      user: {
        firstName: req.user.firstName,
        role: req.user.role,
        id: req.user._id,
      }
    });
  }
};

export default authStatus;
