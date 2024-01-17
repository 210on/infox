import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Button, TextField, Typography } from "@mui/material";
import { useRecoilState } from 'recoil';
import { userAtom } from "../states/userAtom";
import { useNavigate } from 'react-router-dom';

export function APIKeyPage(): JSX.Element {
	const [apiKey, setApiKey] = useState('');
	const [user, setUser] = useRecoilState(userAtom);
	const navigate = useNavigate();

	useEffect(() => {
		if (user?.apiKey) {
			setApiKey(user.apiKey);
		}
	}, [user]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setUser({ ...user, apiKey: apiKey });
		navigate('/memolist');
	};

	const handleDelete = () => {
		setApiKey('');
		setUser({ ...user, apiKey: '' });
	};

	return (
		<div>
			<Typography variant="h4" gutterBottom>
				API Keyを入力してください。
			</Typography>
			{user?.apiKey && (
				<>
					<Typography variant="h6" gutterBottom>
						登録済みです
					</Typography>
					<Button onClick={handleDelete} variant="contained" color="secondary">
						API Keyを削除する
					</Button>
				</>
			)}
			{!user?.apiKey && (
				<form onSubmit={handleSubmit}>
					<TextField
						label="API Key"
						value={apiKey}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
						fullWidth
						margin="normal"
					/>		
					<Button type="submit" variant="contained" color="primary">
						Save
					</Button>
				</form>
			)}
		</div>
	);
}

export default APIKeyPage;