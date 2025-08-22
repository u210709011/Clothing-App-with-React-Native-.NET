import React, { useMemo, useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Text } from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { Colors } from '@/constants/Colors';
import { AdminUser } from '@/services/admin';
import { apiPatch } from '@/services/api';

type Props = {
  visible: boolean;
  user?: AdminUser | null;
  onClose: () => void;
  onSaved?: () => void;
};

export default function UserEditModal({ visible, user, onClose, onSaved }: Props) {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [role, setRole] = useState(user?.role || 'User');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setDisplayName(user?.displayName || '');
    setRole(user?.role || 'User');
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await apiPatch(`/admin/users/${user.uid}`, {
        displayName,
        role,
      });
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit User</Text>
          <Input value={displayName} onChangeText={setDisplayName} placeholder="Display name" label="Display name" />
          <View style={styles.roleRow}>
            <Text style={{ color: Colors.textSecondary }}>Role</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button title="User" type="chip" selected={role === 'User'} onPress={() => setRole('User')} />
              <Button title="Admin" type="chip" selected={role === 'Admin'} onPress={() => setRole('Admin')} />
            </View>
          </View>
          <View style={styles.actions}>
            <Button title="Cancel" type="default" color={Colors.textSecondary} onPress={onClose} disabled={saving} />
            <Button title="Save" onPress={handleSave} disabled={saving} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 16 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: '600', color: Colors.text },
  roleRow: { gap: 8 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
});


