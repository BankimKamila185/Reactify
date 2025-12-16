import User from '../models/User.js';

// Sync Firebase user with MongoDB
export const syncUser = async (req, res) => {
    try {
        const { email, fullName, firebaseUid, organization, role, phoneNumber, photoURL } = req.body;

        if (!firebaseUid || !email) {
            return res.status(400).json({
                success: false,
                error: { message: 'Firebase UID and email are required' }
            });
        }

        // Try to find existing user by Firebase UID or email
        let user = await User.findOne({
            $or: [{ firebaseUid }, { email }]
        });

        if (user) {
            // Update existing user
            user.firebaseUid = firebaseUid;
            user.fullName = fullName || user.fullName;
            user.photoURL = photoURL || user.photoURL;
            if (organization) user.organization = organization;
            if (role) user.role = role;
            if (phoneNumber) user.phoneNumber = phoneNumber;
            user.lastLogin = new Date();
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                email,
                fullName: fullName || email.split('@')[0],
                firebaseUid,
                organization,
                role: role || 'individual',
                phoneNumber,
                photoURL
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    organization: user.organization,
                    photoURL: user.photoURL
                }
            }
        });
    } catch (error) {
        console.error('Sync user error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to sync user' }
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get profile' }
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, organization, role, phoneNumber } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }

        if (fullName) user.fullName = fullName;
        if (organization) user.organization = organization;
        if (role) user.role = role;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    organization: user.organization
                }
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update profile' }
        });
    }
};
